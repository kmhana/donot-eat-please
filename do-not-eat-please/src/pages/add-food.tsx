import { createRoute } from '@granite-js/react-native';
import { Icon } from '@toss/tds-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useFoodContext } from '../context/FoodContext';

const TOSSFACE_URL = 'https://static.toss.im/2d-emojis/svg';

const SUGGESTED_FOODS = [
  { label: '야식', emoji: `${TOSSFACE_URL}/u1F319.svg` },
  { label: '치킨', emoji: `${TOSSFACE_URL}/u1F357.svg` },
  { label: '피자', emoji: `${TOSSFACE_URL}/u1F355.svg` },
  { label: '라면', emoji: `${TOSSFACE_URL}/u1F35C.svg` },
  { label: '간식', emoji: `${TOSSFACE_URL}/u1F370.svg` },
  { label: '탄산음료', emoji: `${TOSSFACE_URL}/u1F964.svg` },
  { label: '커피', emoji: `${TOSSFACE_URL}/u2615.svg` },
  { label: '술', emoji: `${TOSSFACE_URL}/u1F37A.svg` },
] as const;

const EMOJI_OPTIONS = [
  { label: '접시', url: `${TOSSFACE_URL}/u1F37D.svg` },
  { label: '고기', url: `${TOSSFACE_URL}/u1F356.svg` },
  { label: '아이스크림', url: `${TOSSFACE_URL}/u1F366.svg` },
  { label: '햄버거', url: `${TOSSFACE_URL}/u1F354.svg` },
  { label: '감자튀김', url: `${TOSSFACE_URL}/u1F35F.svg` },
  { label: '과자', url: `${TOSSFACE_URL}/u1F36A.svg` },
  { label: '초콜릿', url: `${TOSSFACE_URL}/u1F36B.svg` },
  { label: '케이크', url: `${TOSSFACE_URL}/u1F370.svg` },
  { label: '사탕', url: `${TOSSFACE_URL}/u1F36C.svg` },
  { label: '빵', url: `${TOSSFACE_URL}/u1F950.svg` },
] as const;

export const Route = createRoute('/add-food', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const { addFoodItem } = useFoodContext();
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(
    undefined,
  );

  const handleSave = () => {
    if (name.trim().length === 0) return;
    void addFoodItem(name.trim(), selectedEmoji).then(() =>
      navigation.goBack(),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="icon-arrow-left-mono" size={22} color="#4A5568" />
        </TouchableOpacity>
        <Text style={styles.title}>음식 추가</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.form}>
        <View style={styles.suggestSection}>
          <Text style={styles.suggestLabel}>빠른 추가</Text>
          <View style={styles.chipWrap}>
            {SUGGESTED_FOODS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.chip}
                onPress={() => {
                  void addFoodItem(item.label, item.emoji).then(() =>
                    navigation.goBack(),
                  );
                }}
                activeOpacity={0.7}
              >
                <SvgUri uri={item.emoji} width={20} height={20} />
                <Text style={styles.chipText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.directSection}>
          <Text style={styles.suggestLabel}>직접 입력</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="먹지 않을 음식 이름"
            placeholderTextColor="#A0AEC0"
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <Text style={styles.emojiPickerLabel}>아이콘 선택</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.emojiScroll}
            contentContainerStyle={styles.emojiScrollContent}
          >
            {EMOJI_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={[
                  styles.emojiOption,
                  selectedEmoji === opt.url && styles.emojiOptionSelected,
                ]}
                onPress={() =>
                  setSelectedEmoji((prev) =>
                    prev === opt.url ? undefined : opt.url,
                  )
                }
                activeOpacity={0.7}
              >
                <SvgUri uri={opt.url} width={28} height={28} />
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  emojiPickerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 10,
  },
  emojiScroll: {
    marginBottom: 16,
  },
  emojiScrollContent: {
    gap: 8,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiOptionSelected: {
    borderColor: '#3182F6',
    backgroundColor: '#EBF4FF',
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
  suggestSection: {
    marginBottom: 28,
  },
  directSection: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 20,
  },
  suggestLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  chipEmoji: {
    width: 20,
    height: 20,
  },
  chipText: {
    fontSize: 14,
    color: '#3182F6',
    fontWeight: '600',
  },
});
