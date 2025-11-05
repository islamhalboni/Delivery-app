import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppContext } from '../../../context/app-context';
import { COLORS, FONTS, RADIUS, SIZES, SPACING } from '../../../theme';
import { searchRestaurants } from '../../../services/restaurants-service';
import { searchStores } from '../../../services/stores-service';

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isStore = false, placeholder } = route.params || {};
  const { city, language } = useContext(AppContext);
  const isRTL = language === 'ar';

  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [touched, setTouched] = useState(false);

  const ph = useMemo(() => {
    if (placeholder) return placeholder;
    return isStore
      ? (isRTL ? 'ابحث عن متجر...' : 'Search for a store...')
      : (isRTL ? 'ابحث عن مطعم...' : 'Search for a restaurant...');
  }, [placeholder, isStore, isRTL]);

  const doSearch = async () => {
    const query = q.trim();
    if (!city?.id || !query) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const res = isStore
        ? await searchStores(city.id, query)
        : await searchRestaurants(city.id, query);
      const data = Array.isArray(res?.data) ? res.data : (res?.data?.items || []);
      setResults(data || []);
    } catch (e) {
      console.error('Search error:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    setTouched(true);
    Keyboard.dismiss();
    doSearch();
  };

  useEffect(() => {
    if (!touched) return;
    const id = setTimeout(doSearch, 400);
    return () => clearTimeout(id);
  }, [q, city?.id]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('storeDetailsScreen', { store: item })}
    >
      <Image
        source={{ uri: item.logo_url || 'https://via.placeholder.com/80' }}
        style={styles.logo}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.cardSubtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {item.city || (isRTL ? 'مدينة غير معروفة' : 'Unknown city')}
        </Text>
      </View>
      <Ionicons
        name={isRTL ? 'chevron-back' : 'chevron-forward'}
        size={20}
        color={COLORS.mutedText}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      {/* 🔍 Search Header */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons
            name={isRTL ? 'chevron-forward' : 'chevron-back'}
            size={22}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.mutedText} />
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={ph}
            placeholderTextColor={COLORS.mutedText}
            value={q}
            onChangeText={(t) => {
              setQ(t);
              setTouched(true);
            }}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
            autoFocus
          />
          {!!q && (
            <TouchableOpacity onPress={() => setQ('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.mutedText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 🔄 Loading / Empty / List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="restaurant-outline" size={40} color={COLORS.mutedText} />
          <Text style={styles.emptyText}>
            {touched
              ? (isRTL ? 'لا توجد نتائج مطابقة' : 'No matching results')
              : (isRTL ? 'ابحث حسب الاسم...' : 'Type a name to search...')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDefault },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconBtn: {
    width: 40,
    height: SIZES.inputHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    height: SIZES.inputHeight,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    gap: SPACING.sm,
    // ✅ بديل SHADOWS.card
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: FONTS.md,
    color: COLORS.text,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  emptyText: {
    color: COLORS.mutedText,
    fontSize: FONTS.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    // ✅ بديل SHADOWS.card
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  logo: {
    width: 65,
    height: 65,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
  },
  cardTitle: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.mutedText,
    marginTop: 2,
  },
});
