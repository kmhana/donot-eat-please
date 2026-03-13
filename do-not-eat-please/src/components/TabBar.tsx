import { Icon } from '@toss/tds-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ACTIVE_COLOR = '#3182F6';
const INACTIVE_COLOR = '#A0AEC0';

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
        <Icon
          name="icon-home-mono"
          size={24}
          color={activeTab === 'home' ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
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
        <Icon
          name="icon-book-opened-mono"
          size={24}
          color={activeTab === 'calendar' ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
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
