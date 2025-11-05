import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderBar from "../../../components/HeaderBar.js";
import StoreCard from "../../../components/StoreCard.js";
import StickyOrderBanner from "../../../components/StickyOrderBanner.js";

import { AppContext } from "../../../context/app-context";
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from "../../../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CategoryListScreen({
  title,
  fetchFunction,
  isStore = false,
  bannerImages,
}) {
  const navigation = useNavigation();
  const { city, language } = useContext(AppContext);
  const isRTL = language === "ar";
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const scrollRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const banners = useMemo(
    () =>
      bannerImages?.length
        ? bannerImages
        : [
            { id: 1, src: require("../../../assets/banner1.jpeg") },
            { id: 2, src: require("../../../assets/banner2.jpg") },
            { id: 3, src: require("../../../assets/banner3.jpg") },
          ],
    [bannerImages]
  );

  const fetchData = async (cityId) => {
    try {
      const res = await fetchFunction(cityId);
      setItems(res.data || []);
      setFilteredItems(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (city?.id) {
      setIsLoading(true);
      fetchData(city.id).finally(() => setIsLoading(false));
    }
  }, [city?.id]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const renderMoodItem = ({ item }) => {
    const name = isRTL ? item?.name_ar : item?.name_en;

    const fallbackImages = [
      "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
      "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
      "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
      "https://cdn-icons-png.flaticon.com/512/706/706164.png",
    ];
    const fallback = fallbackImages[item?.id % fallbackImages.length];

    return (
      <TouchableOpacity
        style={styles.moodCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("allStoresScreen", {
            isStore,
            categoryId: item?.id,
            category: item,
          })
        }
      >
        <Image
          source={{ uri: item?.image || fallback }}
          style={styles.moodImage}
          resizeMode="cover"
        />
        <View style={styles.moodInfo}>
          <Text style={styles.moodText } numberOfLines={1}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = useCallback(
    ({ item }) => {
      const titleText = isRTL ? item?.name_ar : item?.name_en;

      return (
        <View style={styles.categorySection}>
          <View
            style={[
              styles.categoryHeader,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Text
              style={[
                styles.categoryTitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {titleText}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("allStoresScreen", {
                  isStore,
                  categoryId: item?.id,
                  category: item,
                })
              }
            >
              <Text style={styles.viewAll}>
                {isRTL ? "عرض الكل" : "View All"}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            inverted={isRTL}
            data={
              Array.isArray(item?.sample_restaurants)
                ? item.sample_restaurants
                : Array.isArray(item?.sample_stores)
                ? item.sample_stores
                : []
            }
            keyExtractor={(el, idx) => String(el?.id ?? idx)}
            renderItem={({ item: entity }) =>
              entity ? (
                <StoreCard
                  restaurant={entity}
                  name={isRTL ? entity?.name_ar : entity?.name_en}
                  onPress={() =>
                    navigation.navigate("storeDetailsScreen", { store: entity })
                  }
                />
              ) : null
            }
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.horizontalList,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          />
        </View>
      );
    },
    [navigation, isStore, isRTL]
  );

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <HeaderBar
        title={isRTL ? "عصيرة الشمالية" : "Asira Al-Shamaliya"}
        subtitle={isRTL ? "نابلس" : "Nablus"}
        onMenuPress={() => console.log("Menu clicked")}
        onLocationPress={() => console.log("Location clicked")}
      />

      {isLoading ? (
        <View style={{ alignItems: "center", marginTop: SPACING.xl }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(it, idx) => String(it?.id ?? `cat-${idx}`)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              {/* ✅ البانرات */}
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  const index = Math.round(x / SCREEN_WIDTH);
                  if (index !== activeSlide) setActiveSlide(index);
                }}
                scrollEventThrottle={16}
                contentContainerStyle={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                {banners.map((b, idx) => (
                  <View key={b.id || idx} style={styles.bannerSlide}>
                    <Image
                      source={b.src}
                      style={styles.bannerImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>

              <View
                style={[
                  styles.dotsRow,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                {banners.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, activeSlide === i && styles.dotActive]}
                  />
                ))}
              </View>

              {/* ✅ سكشن المود */}
              <View style={styles.moodSection}>
                <Text
                  style={[
                    styles.moodTitle,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {isRTL
                    ? "شو حابب تاكل اليوم؟ 😏"
                    : "What Are You In The Mood For? 🤔"}
                </Text>
                <FlatList
                  horizontal
                  inverted={isRTL}
  data={[...items].reverse()} // ✅ عكس الترتيب
                  renderItem={renderMoodItem}
                  keyExtractor={(it, idx) => String(it?.id ?? `mood-${idx}`)}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
    flexDirection: "row-reverse", // ✅ يبدأ من اليمين للشمال
                  }}
                />
              </View>
            </>
          }
        />
      )}

      <StickyOrderBanner style={{ marginBottom: insets.bottom + 50 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  bannerSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.55,
    overflow: "hidden",
    backgroundColor: COLORS.white,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  dotsRow: {
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: SPACING.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: COLORS.whiteDark,
  },
  dotActive: {
    width: 18,
    borderRadius: 6,
    backgroundColor: COLORS.text,
  },
  list: {
    paddingTop: 0,
    paddingBottom: SPACING.xl,
  },

  // ✅ سكشن الـ Mood
  moodSection: {
    marginVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    height: 200,
  },
  moodTitle: {
    fontSize: FONTS.xl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.lg,
    fontFamily: FONTS.family.bold,
  },
  moodCard: {
    width: 100,
    height: 140,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: SPACING.sm,
    overflow: "hidden",
    // ✨ شادو قوي
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  moodImage: {
    width: 80,
    height: 80,
  },
  moodInfo: {
    padding: 6,
  },
  moodText: {
    fontSize: FONTS.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
    textAlign: "center"
    
  },
  moodSubText: {
    fontSize: FONTS.sm,
    color: COLORS.textLight,
  },

  // ✅ الكاتيجوري سكشن
  categorySection: {
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    ...SHADOWS.card,
  },
  categoryHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    marginBottom: SPACING.md,
  },
  categoryTitle: {
    fontSize: FONTS.lg,
    fontWeight: "800",
    color: COLORS.text,
    fontFamily: FONTS.family.bold,
  },
  viewAll: {
    fontSize: FONTS.sm,
    color: COLORS.textLight,
    fontWeight: "600",
    fontFamily: FONTS.family.regular,
  },
  horizontalList: {},
});
