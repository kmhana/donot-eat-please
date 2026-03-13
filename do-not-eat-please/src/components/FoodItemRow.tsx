import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { FoodItem } from 'types';

interface FoodItemRowProps {
  food: FoodItem;
  onEat: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function FoodItemRow({ food, onEat, onDelete }: FoodItemRowProps) {
  const [justEaten, setJustEaten] = useState(false);

  const handleEat = () => {
    void onEat(food.id);
    setJustEaten(true);
    setTimeout(() => setJustEaten(false), 1500);
  };

  const handleLongPress = () => {
    Alert.alert('음식 삭제', `"${food.name}"을(를) 목록에서 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          void onDelete(food.id);
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      <Text style={styles.name}>{food.name}</Text>
      <TouchableOpacity
        style={[styles.eatButton, justEaten && styles.eatButtonDone]}
        onPress={handleEat}
        activeOpacity={0.7}
      >
        <Text style={styles.eatButtonText}>
          {justEaten ? '기록됨 ✓' : '먹었어요'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
  },
  eatButton: {
    backgroundColor: '#3182F6',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  eatButtonDone: {
    backgroundColor: '#68D391',
  },
  eatButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
