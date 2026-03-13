import { createRoute } from '@granite-js/react-native';
import { Icon } from '@toss/tds-react-native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
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
    <ImageBackground
      source={{
        uri: 'https://raw.githubusercontent.com/kmhana/donot-eat-please/main/do-not-eat-please/img/bright.png',
      }}
      style={styles.container}
      imageStyle={styles.bgImage}
    >
      <View style={styles.header}>
        <Text style={styles.title}>제발 먹지마..</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('/add-food')}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonLabel}>음식 추가</Text>
          <Icon name="icon-plus-mono" size={16} color="#4A5568" />
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
    </ImageBackground>
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
  bgImage: {
    opacity: 0.3,
    resizeMode: 'contain',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 4,
  },
  addButtonLabel: {
    color: '#2D3748',
    fontSize: 13,
    fontWeight: '700',
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
