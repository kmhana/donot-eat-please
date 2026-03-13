import { createRoute } from '@granite-js/react-native';
import { Icon } from '@toss/tds-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  CalendarGrid,
  MonthHeader,
  WeekdayLabels,
} from '../components/CalendarGrid';
import { TabBar } from '../components/TabBar';
import { useFoodContext } from '../context/FoodContext';
import type { EatingRecord, FoodItem } from '../types';

function getMonthlyStats(
  year: number,
  month: number,
  records: EatingRecord[],
  foods: FoodItem[],
) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthRecords = records.filter((r) => r.date.startsWith(prefix));
  const total = monthRecords.length;

  const countMap = new Map<string, number>();
  for (const r of monthRecords) {
    countMap.set(r.foodId, (countMap.get(r.foodId) ?? 0) + 1);
  }

  let topFoodId: string | null = null;
  let topCount = 0;
  for (const [foodId, count] of countMap) {
    if (count > topCount) {
      topCount = count;
      topFoodId = foodId;
    }
  }

  const topFoodName = topFoodId
    ? (foods.find((f) => f.id === topFoodId)?.name ?? '(삭제된 음식)')
    : null;

  return { total, topFoodName, topCount };
}

export const Route = createRoute('/calendar', {
  component: Page,
  screenOptions: { animation: 'none' },
});

function Page() {
  const navigation = Route.useNavigation();
  const { foodItems, eatingRecords, deleteEatingRecord, logEating } =
    useFoodContext();
  const [showFoodPicker, setShowFoodPicker] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const goToPrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const stats = getMonthlyStats(year, month, eatingRecords, foodItems);

  const handleDayPress = (dateStr: string) => {
    setSelectedDay(dateStr === selectedDay ? null : dateStr);
    setShowFoodPicker(false);
  };

  const selectedRecords = selectedDay
    ? eatingRecords.filter((r) => r.date === selectedDay)
    : [];

  return (
    <View style={styles.container}>
      <MonthHeader
        year={year}
        month={month}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
      />
      <WeekdayLabels />
      <CalendarGrid
        year={year}
        month={month}
        eatingRecords={eatingRecords}
        foodItems={foodItems}
        onDayPress={handleDayPress}
      />
      {stats.total > 0 && (
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>이번 달 총 {stats.total}회 먹음</Text>
          {stats.topFoodName && (
            <Text style={styles.statsHighlight}>
              {stats.topFoodName} {stats.topCount}번 먹었어..
            </Text>
          )}
        </View>
      )}
      {selectedDay === null && <View style={styles.spacer} />}
      {selectedDay !== null && (
        <View style={styles.dayDetail}>
          <View style={styles.dayDetailHeader}>
            <Text style={styles.dayDetailTitle}>{selectedDay}</Text>
            <TouchableOpacity
              onPress={() => setSelectedDay(null)}
              activeOpacity={0.7}
            >
              <Icon name="icon-x-mono" size={20} color="#A0AEC0" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.recordList}>
            {selectedRecords.length === 0 && (
              <Text style={styles.emptyDetail}>기록이 없어요</Text>
            )}
            {selectedRecords.map((record) => (
              <RecordRow
                key={`${record.foodId}-${record.eatenAt}`}
                record={record}
                foodName={
                  foodItems.find((f) => f.id === record.foodId)?.name ??
                  '(삭제된 음식)'
                }
                onDelete={() =>
                  deleteEatingRecord(record.foodId, record.eatenAt)
                }
              />
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.addRecordButton}
            onPress={() => setShowFoodPicker(true)}
            activeOpacity={0.7}
          >
            <Icon name="icon-plus-mono" size={16} color="#3182F6" />
            <Text style={styles.addRecordText}>기록 추가</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={showFoodPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFoodPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFoodPicker(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>음식 선택</Text>
              <TouchableOpacity
                onPress={() => setShowFoodPicker(false)}
                activeOpacity={0.7}
              >
                <Icon name="icon-x-mono" size={20} color="#A0AEC0" />
              </TouchableOpacity>
            </View>
            {foodItems.length === 0 ? (
              <Text style={styles.emptyDetail}>등록된 음식이 없어요</Text>
            ) : (
              <ScrollView>
                {foodItems.map((food) => (
                  <TouchableOpacity
                    key={food.id}
                    style={styles.bottomSheetItem}
                    onPress={() => {
                      void logEating(food.id, selectedDay ?? undefined);
                      setShowFoodPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.bottomSheetItemText}>{food.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
      <TabBar
        activeTab="calendar"
        onNavigateHome={() =>
          navigation.reset({ index: 0, routes: [{ name: '/' }] })
        }
        onNavigateCalendar={() => {}}
      />
    </View>
  );
}

function RecordRow({
  record,
  foodName,
  onDelete,
}: {
  record: { eatenAt: string };
  foodName: string;
  onDelete: () => void;
}) {
  const swipeableRef = useRef<Swipeable | null>(null);
  const time = new Date(record.eatenAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-70, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          swipeableRef.current?.close();
          void onDelete();
        }}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon name="icon-bin-mono" size={18} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}
    >
      <View style={styles.recordItem}>
        <Text style={styles.recordFoodName}>{foodName}</Text>
        <Text style={styles.recordTime}>{time}</Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F7FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statsText: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '600',
  },
  statsHighlight: {
    fontSize: 13,
    color: '#ED8936',
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  dayDetail: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dayDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayDetailTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
  },
  closeButton: {
    fontSize: 16,
    color: '#A0AEC0',
    padding: 4,
  },
  emptyDetail: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 16,
  },
  recordList: {
    flex: 1,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  recordFoodName: {
    fontSize: 15,
    color: '#2D3748',
  },
  recordTime: {
    fontSize: 13,
    color: '#718096',
  },
  deleteAction: {
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  addRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    gap: 4,
  },
  addRecordText: {
    fontSize: 14,
    color: '#3182F6',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '50%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
  },
  bottomSheetItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  bottomSheetItemText: {
    fontSize: 16,
    color: '#2D3748',
  },
});
