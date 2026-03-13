import { Icon } from '@toss/tds-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { buildCalendarDays, todayString } from '../lib/calendarUtils';
import type { CalendarDay, EatingRecord, FoodItem } from '../types';

const DOT_COLORS = [
  '#FC8181',
  '#68D391',
  '#63B3ED',
  '#F6AD55',
  '#B794F4',
] as const;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  eatingRecords: EatingRecord[];
  foodItems: FoodItem[];
  onDayPress: (dateStr: string) => void;
}

export function CalendarGrid({
  year,
  month,
  eatingRecords,
  foodItems,
  onDayPress,
}: CalendarGridProps) {
  const days = buildCalendarDays(year, month, eatingRecords);
  const today = todayString();

  const rows: CalendarDay[][] = [];
  for (let i = 0; i < 6; i++) {
    rows.push(days.slice(i * 7, (i + 1) * 7));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0]?.date ?? ''} style={styles.row}>
          {row.map((day) => (
            <DayCell
              key={day.date}
              day={day}
              isToday={day.date === today}
              foodItems={foodItems}
              onPress={() => onDayPress(day.date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

interface DayCellProps {
  day: CalendarDay;
  isToday: boolean;
  foodItems: FoodItem[];
  onPress: () => void;
}

function DayCell({ day, isToday, foodItems, onPress }: DayCellProps) {
  const parts = day.date.split('-');
  const dayNumber = Number.parseInt(parts[2] ?? '0', 10);
  const uniqueFoodIds = [...new Set(day.records.map((r) => r.foodId))];
  const visibleDots = uniqueFoodIds.slice(0, 3);
  const extraCount = uniqueFoodIds.length - visibleDots.length;

  return (
    <TouchableOpacity style={styles.cell} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.dateCircle, isToday && styles.todayCircle]}>
        <Text
          style={[
            styles.dateText,
            !day.isCurrentMonth && styles.dimText,
            isToday && styles.todayText,
          ]}
        >
          {dayNumber}
        </Text>
      </View>
      <View style={styles.dotsRow}>
        {visibleDots.map((foodId) => {
          const foodIndex = foodItems.findIndex((f) => f.id === foodId);
          const colorIndex =
            (foodIndex >= 0 ? foodIndex : 0) % DOT_COLORS.length;
          const color = DOT_COLORS[colorIndex] ?? '#3182F6';
          return (
            <View
              key={foodId}
              style={[styles.dot, { backgroundColor: color }]}
            />
          );
        })}
        {extraCount > 0 && <Text style={styles.extraText}>+{extraCount}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export function MonthHeader({
  year,
  month,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.monthHeader}>
      <TouchableOpacity
        onPress={onPrev}
        style={styles.arrowButton}
        activeOpacity={0.7}
      >
        <Icon name="chevron-left" size={24} color="#4A5568" />
      </TouchableOpacity>
      <Text style={styles.monthTitle}>
        {year}년 {month + 1}월
      </Text>
      <TouchableOpacity
        onPress={onNext}
        style={styles.arrowButton}
        activeOpacity={0.7}
      >
        <Icon name="chevron-right" size={24} color="#4A5568" />
      </TouchableOpacity>
    </View>
  );
}

export function WeekdayLabels() {
  return (
    <View style={styles.weekdayRow}>
      {WEEKDAYS.map((label) => (
        <Text
          key={label}
          style={[styles.weekdayLabel, label === '일' && styles.sundayLabel]}
        >
          {label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    minHeight: 48,
  },
  dateCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    backgroundColor: '#3182F6',
  },
  dateText: {
    fontSize: 14,
    color: '#2D3748',
  },
  dimText: {
    color: '#CBD5E0',
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    height: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  extraText: {
    fontSize: 8,
    color: '#A0AEC0',
    marginLeft: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  arrowButton: {
    padding: 8,
  },
  arrowText: {
    fontSize: 24,
    color: '#4A5568',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  sundayLabel: {
    color: '#FC8181',
  },
});
