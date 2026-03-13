import type { CalendarDay, EatingRecord } from 'types';

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayString(): string {
  return formatDate(new Date());
}

export function buildCalendarDays(
  year: number,
  month: number, // 0-indexed
  records: EatingRecord[],
): CalendarDay[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const recordsByDate = new Map<string, EatingRecord[]>();
  for (const record of records) {
    const existing = recordsByDate.get(record.date);
    if (existing !== undefined) {
      existing.push(record);
    } else {
      recordsByDate.set(record.date, [record]);
    }
  }

  const cells: CalendarDay[] = [];

  // Trailing days from previous month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({
      date,
      isCurrentMonth: false,
      records: recordsByDate.get(date) ?? [],
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({
      date,
      isCurrentMonth: true,
      records: recordsByDate.get(date) ?? [],
    });
  }

  // Leading days from next month
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextDay = 1;
  while (cells.length < 42) {
    const date = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
    cells.push({
      date,
      isCurrentMonth: false,
      records: recordsByDate.get(date) ?? [],
    });
    nextDay++;
  }

  return cells;
}
