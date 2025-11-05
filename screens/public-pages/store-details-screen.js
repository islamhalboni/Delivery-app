import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import StickyCartBar from '../../components/StickyCartBar';
import StickyOrderBanner from '../../components/StickyOrderBanner';
import MenuItemCard from '../../components/menu-item-card';
import ItemModal from '../../components/menu-item-modal';

import { getRestaurantMenu } from '../../services/restaurants-service';
import { AppContext } from '../../context/app-context';
import { useOrder } from '../../context/orders-context';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../theme';

export default function StoreDetailsScreen({ route }) {
  const { store } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { language } = useContext(AppContext);
  const isRTL = language === 'ar';

  const { orders, addToCart } = useOrder();

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollViewRef = useRef();
  const sectionRefs = useRef({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getRestaurantMenu(store.id);
        if (!alive) return;
        const apiMenu = res?.data?.menu || [];
        setMenuData(apiMenu);
        setSelectedCategoryId(apiMenu?.[0]?.category_id || null);
      } catch (e) {
        console.warn(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [store?.id]);

  const openItemModal = (item) => setSelectedItem({ ...item, store });

  const handleCategoryPress = (categoryId) => {
    setSelectedCategoryId(categoryId);
    const target = sectionRefs.current[categoryId];
    if (target) {
      target.measureLayout(
        scrollViewRef.current,
        (_x, y) => scrollViewRef.current.scrollTo({ y, animated: true }),
        () => {}
      );
    }
  };

  const handleAddToCart = (item) => {
    const price = Number(item?.price) || 0;
    if (price <= 0) return;
    const quantity = 1;
    addToCart({
      store,
      item: {
        id: item.id,
        name: item.name || item.name_ar || item.name_en,
        price,
        image: item.image,
      },
      addons: [],
      quantity,
      total: (price * quantity).toFixed(2),
    });
  };

  const hasConflictingOrder =
    Array.isArray(orders) &&
    orders.length > 0 &&
    orders[0]?.store?.id !== store?.id;

  const deliveryFee = store?.delivery_fee ?? 14;
  const etaMinutes = store?.eta_minutes ?? 35;
  const areaText = store?.area || store?.address || '';

  const filteredMenuData = menuData
    .map(category => ({
      ...category,
      items: category.items.filter(item => {
        const name = (language === 'ar' ? item.name_ar : item.name_en) || item.name;
        return name?.toLowerCase().includes(searchQuery.toLowerCase());
      })
    }))
    .filter(category => category.items.length > 0);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.xxl + 80 }}
      >
        {/* === Header === */}
        <View style={styles.headerWrap}>
          <Image
            source={{ uri: store.cover_url || store.logo_url }}
            style={styles.cover}
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { top: insets.top + 8 }]}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.black} />
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <Image source={{ uri: store.logo_url }} style={styles.logoImg} />
          </View>

          <View style={styles.bgBlock}>
            <View style={styles.details}>
              <Text style={styles.storeName}>{store.name}</Text>
              {!!areaText && <Text style={styles.areaText}>{areaText}</Text>}

              <View style={[styles.pillsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={[styles.outlinePill, styles.outlinePillAccent]}>
                  <Ionicons name="time-outline" size={14} color={COLORS.accent} />
                  <Text style={styles.outlineTxt}>
                    {isRTL ? `دقيقة ${etaMinutes}` : `${etaMinutes} min`}
                  </Text>
                </View>
                <View style={[styles.outlinePill, styles.outlinePillAccent]}>
                  <Text style={styles.outlineTxt}>
                    {isRTL ? `₪${deliveryFee} التوصيل` : `Delivery ₪${deliveryFee}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* === Search Bar === */}
        <View style={[styles.searchWrapper, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={searchQuery ? COLORS.primary : COLORS.mutedText} 
            style={{ marginHorizontal: 8 }} 
          />
          <TextInput
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={isRTL ? "ابحث عن صنف..." : "Search for an item..."}
            placeholderTextColor={COLORS.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={COLORS.mutedText} 
                style={{ marginHorizontal: 8 }} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* === Categories / Menu === */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : filteredMenuData.length === 0 ? (
          <Text style={styles.emptyText}>
            {isRTL ? 'لا يوجد أصناف مطابقة' : 'No matching items'}
          </Text>
        ) : (
          <>
            <View style={styles.stickyContainer}>
              <FlatList
                data={filteredMenuData}
                keyExtractor={(it) => it.category_id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                inverted={isRTL}
                contentContainerStyle={styles.categoryList}
                renderItem={({ item }) => {
                  const isActive = selectedCategoryId === item.category_id;
                  return (
                    <TouchableOpacity
                      onPress={() => handleCategoryPress(item.category_id)}
                      style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
                    >
                      <Text
                        style={[styles.categoryButtonText, isActive && styles.categoryButtonTextActive]}
                      >
                        {isRTL ? item.category_name_ar : item.category_name_en}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <View style={styles.menuContainer}>
              {filteredMenuData.map((category) => (
                <View
                  key={category.category_id}
                  ref={(ref) => (sectionRefs.current[category.category_id] = ref)}
                  style={styles.categorySection}
                >
                  <Text style={[styles.categoryTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {isRTL ? category.category_name_ar : category.category_name_en}
                  </Text>

                  <FlatList
                    data={category.items}
                    keyExtractor={(it) => it.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    inverted={isRTL}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
                    renderItem={({ item }) => (
                      <MenuItemCard
                        item={item}
                        language={language}
                        onPress={() => openItemModal(item)}
                        onAdd={() => handleAddToCart(item)}
                      />
                    )}
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* === Modal for item details === */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(item, quantity, selectedAddons) => {
            // ✅ هنا بيربط زر "أضف إلى السلة" بالـ context
            const price = Number(item?.price) || 0;
            const addonsTotal = Object.values(selectedAddons || {}).flat().reduce(
              (sum, a) => sum + (Number(a?.price) || 0),
              0
            );
            const total = (price + addonsTotal) * quantity;

            addToCart({
              store,
              item: {
                id: item.id,
                name: item.name_ar || item.name_en || item.name,
                price,
                image: item.image,
              },
              addons: Object.values(selectedAddons || {}).flat(),
              quantity,
              total: total.toFixed(2),
            });
          }}
        />
      )}

      {hasConflictingOrder && <StickyOrderBanner />}

      {/* ✅ البار يظهر إذا في منتجات */}
      {orders.length > 0 && <StickyCartBar targetRoute="CartScreen" />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F2F8' },
  headerWrap: { position: 'relative', backgroundColor: '#F3F2F8' },
  cover: { width: '100%', height: 240 },
  backBtn: {
    position: 'absolute',
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  logoWrap: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -66 }],
    bottom: 100,
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: COLORS.white,
    padding: 6,
    zIndex: 15,
    ...SHADOWS.card,
  },
  logoImg: { width: '100%', height: '100%', borderRadius: 999 },
  bgBlock: {
    backgroundColor: COLORS.white,
    paddingTop: 66 + 12,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  details: { alignItems: 'center' },
  storeName: { 
    fontSize: FONTS.xl, 
    fontFamily: FONTS.family.bold, // 👈 bold Tajawal
    color: COLORS.text, 
    textAlign: 'center' 
  },
  areaText: { 
    marginTop: 4, 
    fontSize: FONTS.sm, 
    fontFamily: FONTS.family.regular, // 👈 regular Tajawal
    color: COLORS.mutedText, 
    textAlign: 'center' 
  },
  pillsRow: { 
    marginTop: SPACING.md, 
    width: '100%', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  outlinePill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
  },
  outlinePillAccent: { borderWidth: 1, borderColor: COLORS.accent },
  outlineTxt: { 
    color: COLORS.accent, 
    fontSize: FONTS.md, 
    fontFamily: FONTS.family.bold, // 👈 bold Tajawal
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: SPACING.xl, 
    color: COLORS.mutedText,
    fontFamily: FONTS.family.regular, // 👈
  },
  searchWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 40,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    paddingHorizontal: 10,
    height: 50,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.md,
    color: COLORS.text,
    fontFamily: FONTS.family.regular, // 👈
  },
  categoryList: { paddingHorizontal: SPACING.md, marginTop: SPACING.md },
  categoryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    marginHorizontal: 5,
    backgroundColor: COLORS.bgLight,
  },
  categoryButtonActive: { backgroundColor: COLORS.primary },
  categoryButtonText: { 
    fontSize: FONTS.sm, 
    color: COLORS.text,
    fontFamily: FONTS.family.regular, // 👈
  },
  categoryButtonTextActive: { 
    color: COLORS.white, 
    fontFamily: FONTS.family.bold, // 👈
  },
  menuContainer: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, backgroundColor: '#F3F2F8' },
  categorySection: { marginBottom: SPACING.lg },
  categoryTitle: { 
    fontSize: FONTS.xl, 
    fontFamily: FONTS.family.bold, // 👈
    color: COLORS.text, 
    marginBottom: SPACING.md 
  },
});
