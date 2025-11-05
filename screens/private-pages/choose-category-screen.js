import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { AppContext } from "../../context/app-context";
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from "../../theme";

const categories = [
  { id: 6, name_en: "Desserts", name_ar: "حلويات", isStore: true, icon: "🍰", colors: ["#ffdde1", "#ee9ca7"] },
  { id: 7, name_en: "Pharmacy", name_ar: "صيدليات", isStore: true, icon: "💊", colors: ["#d4fc79", "#96e6a1"] },
  { id: 4, name_en: "Vape Shops", name_ar: "سجائر إلكترونية", isStore: true, icon: "🚬", colors: ["#bdc3c7", "#2c3e50"] },
  { id: 15, name_en: "Drinks", name_ar: "مشروبات", isStore: false, icon: "🥤", colors: ["#89f7fe", "#66a6ff"] },
  { id: 2, name_en: "Products", name_ar: "منتجات", isStore: true, icon: "📦", colors: ["#fdfbfb", "#ebedee"] },
];

export default function ChooseCategoryScreen() {
  const navigation = useNavigation();
  const { language } = useContext(AppContext);
  const isRTL = language === "ar";
  const insets = useSafeAreaInsets();

  const handleSelect = (category) => {
    navigation.navigate("allStoresScreen", {
      categoryId: category.id,
      category: { name_en: category.name_en, name_ar: category.name_ar },
      isStore: category.isStore,
    });
  };

  const renderCategory = ({ item, index }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 150).springify()}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelect(item)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={item.colors}
          style={styles.gradientBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.cardIcon}>{item.icon}</Text>
          <Text
            style={[
              styles.cardText,
              { textAlign: isRTL ? "right" : "left", writingDirection: isRTL ? "rtl" : "ltr" },
            ]}
          >
            {isRTL ? item.name_ar : item.name_en}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* ===== Header ===== */}
      <View style={styles.headerSection}>
        <Text
          style={[
            styles.title,
            { textAlign: isRTL ? "right" : "left", writingDirection: isRTL ? "rtl" : "ltr" },
          ]}
        >
          {isRTL ? "يمكنك التسوق أكثر" : "Choose a Category"}
        </Text>
      </View>

      {/* ===== Categories ===== */}
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={renderCategory}
        contentContainerStyle={styles.gridList}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: SPACING.md,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDefault,
  },
  headerSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: FONTS.title,
    fontFamily: "TajawalBold",
    color: COLORS.primary,
  },
  gridList: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    rowGap: SPACING.md,
  },
  cardWrapper: {
    width: "48%",
  },
  card: {
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  gradientBg: {
    paddingVertical: SPACING.lg * 2,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  cardText: {
    fontSize: FONTS.lg + 2,
    fontFamily: "TajawalBold",
    color: "#333",
  },
});
