import { createRoute } from '@granite-js/react-native';
import { Icon } from '@toss/tds-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFoodContext } from '../context/FoodContext';

export const Route = createRoute('/add-food', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const { addFoodItem } = useFoodContext();
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim().length === 0) return;
    void addFoodItem(name.trim()).then(() => navigation.goBack());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={22} color="#4A5568" />
        </TouchableOpacity>
        <Text style={styles.title}>음식 추가</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="먹지 않을 음식 이름"
          placeholderTextColor="#A0AEC0"
          autoFocus
          maxLength={30}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
        <TouchableOpacity
          style={[
            styles.saveButton,
            name.trim().length === 0 && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={name.trim().length === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
  },
  backText: {
    fontSize: 22,
    color: '#4A5568',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
  },
  form: {
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3748',
    backgroundColor: '#F7FAFC',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#3182F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
