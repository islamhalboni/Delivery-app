import React, { useContext } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useOrder } from "../../context/orders-context";
import { AppContext } from "../../context/app-context";
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from "../../theme";

export default function CartScreen({ navigation }) {
  const { orders } = useOrder();
  const { language } = useContext(AppContext);
  const isRTL = language === "ar";

  // المحلات الفريدة
  const uniqueStores = [
    ...new Map(
      orders.map((o) => [o.store?.id || o.restaurant?.id, o.store || o.restaurant])
    ).values(),
  ];

  const total = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      {/* Header - صور + أسماء المحلات */}
      <View style={styles.headerTop}>
        <View style={styles.storesRow}>
          {uniqueStores.slice(0, 2).map((s, idx) => (
            <View key={idx} style={styles.storeInfo}>
              <Image
                source={{ uri: s?.logo_url || s?.image }}
                style={styles.storeLogo}
                resizeMode="cover"
              />
              <Text style={styles.storeTitle}>{s?.name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.cartTitle}>
          {isRTL ? "سلة الطلبات" : "My Cart"}
        </Text>
      </View>

      {/* Summary Box */}
      <View style={{ padding: SPACING.lg }}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {isRTL ? "المجموع" : "Subtotal"}
            </Text>
            <Text style={styles.summaryValue}>₪ {total.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {isRTL ? "التوصيل" : "Delivery"}
            </Text>
            <Text style={styles.summaryValue}>
              {isRTL ? "مجاني" : "Free"}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>
              {isRTL ? "الإجمالي" : "Total"}
            </Text>
            <Text style={styles.totalText}>₪ {(total + 2).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Cart Items */}
      <ScrollView contentContainerStyle={styles.container}>
        {orders.map((order, index) => {
          const item = order.item;
          const storeName = order.store?.name || order.restaurant?.name;
          const name = isRTL ? item.name_ar : item.name_en;
          const addons = order.addons || [];

          return (
            <View
              key={index}
              style={[
                styles.itemBox,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.itemTitle}>{name}</Text>
                  <Text style={styles.unitPrice}>
                    ₪ {parseFloat(item.price).toFixed(2)}
                  </Text>
                </View>

                {/* من أي محل */}
                <Text style={styles.itemStore}>
                   {isRTL ? `من ${storeName}` : `From ${storeName}`}
                </Text>

                {/* الكمية */}
                <Text style={styles.itemNote}>
                  {isRTL ? "الكمية:" : "Qty:"} × {order.quantity}
                </Text>

                {/* الإضافات */}
                {addons.length > 0 && (
                  <Text style={styles.addonText}>
                    {addons
                      .map((addon) =>
                        `${
                          isRTL ? addon.name_ar || addon.name : addon.name
                        } (+₪${parseFloat(addon.price).toFixed(2)})`
                      )
                      .join(isRTL ? "، " : ", ")}
                  </Text>
                )}

                {/* السعر النهائي */}
                <Text style={styles.itemPrice}>
                  ₪ {parseFloat(order.total).toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <View style={styles.buttonsRow}>
          {uniqueStores.length < 2 && (
            <TouchableOpacity
              style={{ flex: 0.6, marginRight: SPACING.sm }}
              onPress={() => navigation.navigate("chooseCategoryScreen")}
            >
              <LinearGradient
                colors={[COLORS.accent, COLORS.primary]}
                style={styles.addOrderButton}
              >
                <Text style={styles.addOrderText}>
                  {isRTL ? "➕ أضف طلب آخر" : "➕ Add Another"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{ flex: uniqueStores.length < 2 ? 0.4 : 1 }}
            onPress={() => navigation.navigate("CheckoutStep2")}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              style={styles.checkoutButton}
            >
              <Text style={styles.checkoutText}>
                {isRTL ? "التالي " : "Checkout r"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDefault },

  /* Header */
  headerTop: {
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
  },
  storesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  storeInfo: {
    alignItems: "center",
    marginHorizontal: SPACING.sm,
  },
  storeLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  storeTitle: {
    fontSize: FONTS.md,
    fontWeight: "600",
    color: COLORS.text,
    fontFamily: FONTS.family.regular,
  },
  cartTitle: {
    fontSize: FONTS.lg + 2,
    fontWeight: "bold",
    color: COLORS.primary,
    fontFamily: FONTS.family.bold,
  },

  /* Summary */
  container: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  summaryBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  summaryLabel: { fontSize: FONTS.lg, color: COLORS.text, fontFamily: FONTS.family.regular },
  summaryValue: { fontSize: FONTS.lg, color: COLORS.text, fontWeight: "600", fontFamily: FONTS.family.bold },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
  totalText: { fontSize: FONTS.xl, fontWeight: "bold", color: COLORS.primary, fontFamily: FONTS.family.bold },

  /* Items */
  itemBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: "row",
    ...SHADOWS.card,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.md,
  },
  itemDetails: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  itemTitle: {
    fontSize: FONTS.lg,
    fontWeight: "700",
    color: COLORS.black,
    fontFamily: FONTS.family.bold,
  },
  itemStore: {
    fontSize: FONTS.md,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    fontFamily: FONTS.family.regular,
  },
  unitPrice: { fontSize: FONTS.md, color: COLORS.text, fontFamily: FONTS.family.regular },
  itemNote: { fontSize: FONTS.md, color: COLORS.mutedText, marginBottom: SPACING.xs, fontFamily: FONTS.family.regular },
  addonText: { fontSize: FONTS.md, color: COLORS.text, marginBottom: SPACING.xs, fontFamily: FONTS.family.regular },
  itemPrice: {
    fontSize: FONTS.lg,
    color: COLORS.accent,
    fontWeight: "bold",
    marginTop: SPACING.sm,
    fontFamily: FONTS.family.bold,
  },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  buttonsRow: { flexDirection: "row", alignItems: "center" },
  addOrderButton: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  addOrderText: { color: COLORS.white, fontSize: FONTS.md + 1, fontWeight: "bold", fontFamily: FONTS.family.bold },
  checkoutButton: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  checkoutText: { color: COLORS.white, fontSize: FONTS.md + 1, fontWeight: "bold", fontFamily: FONTS.family.bold },
});
