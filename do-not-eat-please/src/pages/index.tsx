import { createRoute } from '@granite-js/react-native';
import { Icon } from '@toss/tds-react-native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FoodItemRow } from '../components/FoodItemRow';
import { TabBar } from '../components/TabBar';
import { useFoodContext } from '../context/FoodContext';
import type { FoodItem } from '../types';

export const Route = createRoute('/', {
  component: Page,
  screenOptions: { animation: 'none' },
});

function Page() {
  const navigation = Route.useNavigation();
  const { foodItems, isLoaded, logEating, deleteFoodItem } = useFoodContext();

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3182F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>먹지마 제발..</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('/add-food')}
          activeOpacity={0.7}
        >
          <Icon name="icon-plus-mono" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={foodItems}
        keyExtractor={(item: FoodItem) => item.id}
        renderItem={({ item }) => (
          <FoodItemRow
            food={item}
            onEat={logEating}
            onDelete={deleteFoodItem}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 참고 있는 음식이 없어요.</Text>
            <Text style={styles.emptySubText}>+ 버튼으로 추가해보세요!</Text>
          </View>
        }
        style={styles.list}
      />
      <TabBar
        activeTab="home"
        onNavigateHome={() => {}}
        onNavigateCalendar={() =>
          navigation.reset({ index: 0, routes: [{ name: '/calendar' }] })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A202C',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3182F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '300',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
});
