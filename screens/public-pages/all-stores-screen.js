import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import StoreCard from '../../components/StoreCard';
import { AppContext } from '../../context/app-context';
import { COLORS, FONTS, SPACING } from '../../theme';
import { getRestaurantsByTypeAndCity } from '../../services/restaurants-service';
import { getStoresByTypeAndCity } from '../../services/stores-service';

const AllStoresScreen = ({ route }) => {
  const { categoryId, category, isStore } = route.params;
  const navigation = useNavigation();
  const { city, language } = useContext(AppContext);
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    try {
      const res = isStore
        ? await getStoresByTypeAndCity(city.id, categoryId)
        : await getRestaurantsByTypeAndCity(city.id, categoryId);

      // فلترة العناصر: show only active
      const filtered = (res.data || []).filter((item) => item.active !== false);
      setItems(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (city?.id) {
      setIsLoading(true);
      fetchData().finally(() => setIsLoading(false));
    }
  }, [city?.id, categoryId, isStore]);

  const renderCard = ({ item }) => (
    <View style={styles.cardWrapper}>
      <StoreCard
        restaurant={item}
        name={language === 'ar' ? (item.name_ar || item.name) : (item.name_en || item.name)}
        onPress={() => navigation.navigate('storeDetailsScreen', { store: item })}
      />
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ===== Header ===== */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>
          {language === 'ar' ? category?.name_ar : category?.name_en}
        </Text>
        <View style={styles.headerLine} />
      </View>

      {/* ===== Grid ===== */}
      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : items.length === 0 ? (
        <Text style={styles.emptyText}>
          {language === 'ar' ? 'لا توجد نتائج' : 'No results'}
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={renderCard}
          contentContainerStyle={styles.gridList}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.lg,
          }}
        />
      )}
    </View>
  );
};

export default AllStoresScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDefault,
  },
  headerSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.title + 6,
    fontFamily: FONTS.family.bold,
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  headerLine: {
    marginTop: SPACING.sm,
    width: 80,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  loaderWrap: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  gridList: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    rowGap: SPACING.lg,
  },
  cardWrapper: {
    width: '47%',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: FONTS.lg,
    color: COLORS.mutedText,
    fontFamily: FONTS.family.regular,
  },
});
