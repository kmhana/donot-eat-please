import { Storage } from '@apps-in-toss/framework';
import type { EatingRecord, FoodItem } from '../types';

const KEYS = {
  FOOD_ITEMS: 'food-items',
  EATING_RECORDS: 'eating-records',
} as const;

export async function loadFoodItems(): Promise<FoodItem[]> {
  try {
    const raw = await Storage.getItem(KEYS.FOOD_ITEMS);
    if (raw === null) return [];
    return JSON.parse(raw) as FoodItem[];
  } catch {
    return [];
  }
}

export async function saveFoodItems(items: FoodItem[]): Promise<void> {
  await Storage.setItem(KEYS.FOOD_ITEMS, JSON.stringify(items));
}

export async function loadEatingRecords(): Promise<EatingRecord[]> {
  try {
    const raw = await Storage.getItem(KEYS.EATING_RECORDS);
    if (raw === null) return [];
    return JSON.parse(raw) as EatingRecord[];
  } catch {
    return [];
  }
}

export async function saveEatingRecords(
  records: EatingRecord[],
): Promise<void> {
  await Storage.setItem(KEYS.EATING_RECORDS, JSON.stringify(records));
}
