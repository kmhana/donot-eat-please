import { createRoute } from '@granite-js/react-native';
import { Icon } from '@toss/tds-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CalendarGrid,
  MonthHeader,
  WeekdayLabels,
} from '../components/CalendarGrid';
import { TabBar } from '../components/TabBar';
import { useFoodContext } from '../context/FoodContext';

export const Route = createRoute('/calendar', {
  component: Page,
  screenOptions: { animation: 'none' },
});

function Page() {
  const navigation = Route.useNavigation();
  const { foodItems, eatingRecords } = useFoodContext();

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

  const handleDayPress = (dateStr: string) => {
    setSelectedDay(dateStr === selectedDay ? null : dateStr);
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
          {selectedRecords.length === 0 ? (
            <Text style={styles.emptyDetail}>기록이 없어요</Text>
          ) : (
            <ScrollView style={styles.recordList}>
              {selectedRecords.map((record) => {
                const food = foodItems.find((f) => f.id === record.foodId);
                const time = new Date(record.eatenAt).toLocaleTimeString(
                  'ko-KR',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                );
                return (
                  <View
                    key={`${record.foodId}-${record.eatenAt}`}
                    style={styles.recordItem}
                  >
                    <Text style={styles.recordFoodName}>
                      {food?.name ?? '(삭제된 음식)'}
                    </Text>
                    <Text style={styles.recordTime}>{time}</Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
});
