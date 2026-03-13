export interface FoodItem {
  id: string;
  name: string;
  createdAt: string;
}

export interface EatingRecord {
  foodId: string;
  date: string; // 'YYYY-MM-DD'
  eatenAt: string; // ISO string
}

export interface CalendarDay {
  date: string; // 'YYYY-MM-DD'
  isCurrentMonth: boolean;
  records: EatingRecord[];
}
