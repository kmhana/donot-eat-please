import { Icon } from '@toss/tds-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import type { FoodItem } from '../types';

const COMFORT_MESSAGES = [
  '다음엔 참을 수 있어!',
  '괜찮아, 내일부터 다시!',
  '다음엔 꼭 참아보자!',
  '오늘은 넘어가자..',
  '이번이 마지막이다..!',
] as const;

function randomComfort(): string {
  const idx = Math.floor(Math.random() * COMFORT_MESSAGES.length);
  return COMFORT_MESSAGES[idx] ?? COMFORT_MESSAGES[0];
}

interface FoodItemRowProps {
  food: FoodItem;
  onEat: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  editMode?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onReorder?: (id: string, direction: 'up' | 'down') => Promise<void>;
}

export function FoodItemRow({
  food,
  onEat,
  onDelete,
  editMode = false,
  isFirst = false,
  isLast = false,
  onReorder,
}: FoodItemRowProps) {
  const [justEaten, setJustEaten] = useState(false);
  const [comfortMsg, setComfortMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeableRef = useRef<Swipeable | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const handleEat = () => {
    void onEat(food.id);
    setComfortMsg(randomComfort());
    setJustEaten(true);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustEaten(false), 2500);
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    void onDelete(food.id);
  };

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={handleDelete}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon name="icon-bin-mono" size={22} color="#FFFFFF" />
          <Text style={styles.deleteActionText}>삭제</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (editMode) {
    return (
      <View style={styles.container}>
        <View style={styles.reorderButtons}>
          <TouchableOpacity
            onPress={() => void onReorder?.(food.id, 'up')}
            disabled={isFirst}
            activeOpacity={0.7}
            style={[styles.arrowButton, isFirst && styles.arrowButtonDisabled]}
          >
            <Icon
              name="icon-arrow-up-mono"
              size={18}
              color={isFirst ? '#CBD5E0' : '#4A5568'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => void onReorder?.(food.id, 'down')}
            disabled={isLast}
            activeOpacity={0.7}
            style={[styles.arrowButton, isLast && styles.arrowButtonDisabled]}
          >
            <Icon
              name="icon-arrow-down-mono"
              size={18}
              color={isLast ? '#CBD5E0' : '#4A5568'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{food.name}</Text>
      </View>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}
    >
      <View style={styles.container}>
        <Text style={styles.name}>{food.name}</Text>
        <TouchableOpacity
          style={[styles.eatButton, justEaten && styles.eatButtonDone]}
          onPress={handleEat}
          activeOpacity={0.7}
        >
          <Text style={styles.eatButtonText}>
            {justEaten ? comfortMsg : '먹었어요 ㅠㅜ'}
          </Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
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
  reorderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
  },
  arrowButton: {
    padding: 4,
  },
  arrowButtonDisabled: {
    opacity: 0.4,
  },
  deleteAction: {
    backgroundColor: '#E53E3E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
