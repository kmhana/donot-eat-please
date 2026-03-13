import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { formatDate } from '../lib/calendarUtils';
import {
  loadEatingRecords,
  loadFoodItems,
  saveEatingRecords,
  saveFoodItems,
} from '../lib/storage';
import type { EatingRecord, FoodItem } from '../types';

interface FoodContextValue {
  foodItems: FoodItem[];
  eatingRecords: EatingRecord[];
  isLoaded: boolean;
  addFoodItem: (name: string) => Promise<void>;
  deleteFoodItem: (id: string) => Promise<void>;
  logEating: (foodId: string, date?: string) => Promise<void>;
  deleteEatingRecord: (foodId: string, eatenAt: string) => Promise<void>;
}

const FoodContext = createContext<FoodContextValue | null>(null);

export function FoodProvider({ children }: { children: React.ReactNode }) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [eatingRecords, setEatingRecords] = useState<EatingRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      const [items, records] = await Promise.all([
        loadFoodItems(),
        loadEatingRecords(),
      ]);
      setFoodItems(items);
      setEatingRecords(records);
      setIsLoaded(true);
    })();
  }, []);

  const addFoodItem = useCallback(
    async (name: string) => {
      const newItem: FoodItem = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString(),
      };
      const next = [...foodItems, newItem];
      setFoodItems(next);
      await saveFoodItems(next);
    },
    [foodItems],
  );

  const deleteFoodItem = useCallback(
    async (id: string) => {
      const nextItems = foodItems.filter((f) => f.id !== id);
      const nextRecords = eatingRecords.filter((r) => r.foodId !== id);
      setFoodItems(nextItems);
      setEatingRecords(nextRecords);
      await Promise.all([
        saveFoodItems(nextItems),
        saveEatingRecords(nextRecords),
      ]);
    },
    [foodItems, eatingRecords],
  );

  const logEating = useCallback(
    async (foodId: string, date?: string) => {
      const now = new Date();
      const record: EatingRecord = {
        foodId,
        date: date ?? formatDate(now),
        eatenAt: now.toISOString(),
      };
      const next = [...eatingRecords, record];
      setEatingRecords(next);
      await saveEatingRecords(next);
    },
    [eatingRecords],
  );

  const deleteEatingRecord = useCallback(
    async (foodId: string, eatenAt: string) => {
      const next = eatingRecords.filter(
        (r) => !(r.foodId === foodId && r.eatenAt === eatenAt),
      );
      setEatingRecords(next);
      await saveEatingRecords(next);
    },
    [eatingRecords],
  );

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        eatingRecords,
        isLoaded,
        addFoodItem,
        deleteFoodItem,
        logEating,
        deleteEatingRecord,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
}

export function useFoodContext(): FoodContextValue {
  const ctx = useContext(FoodContext);
  if (ctx === null)
    throw new Error('useFoodContext must be used within FoodProvider');
  return ctx;
}
