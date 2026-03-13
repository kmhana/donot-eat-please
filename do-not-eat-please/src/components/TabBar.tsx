import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabBarProps {
  activeTab: 'home' | 'calendar';
  onNavigateHome: () => void;
  onNavigateCalendar: () => void;
}

export function TabBar({
  activeTab,
  onNavigateHome,
  onNavigateCalendar,
}: TabBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={onNavigateHome}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>🏠</Text>
        <Text
          style={[styles.label, activeTab === 'home' && styles.activeLabel]}
        >
          홈
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={onNavigateCalendar}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>📅</Text>
        <Text
          style={[styles.label, activeTab === 'calendar' && styles.activeLabel]}
        >
          캘린더
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 2,
  },
  activeLabel: {
    color: '#3182F6',
    fontWeight: '600',
  },
});
