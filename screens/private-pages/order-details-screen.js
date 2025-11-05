import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/AppHeader";
import { AppContext } from "../../context/app-context";
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from "../../theme";

export default function OrderDetailsScreen({ route }) {
  const { language } = useContext(AppContext);
  const isRTL = language === "ar";
  const { order } = route.params; // ✅ استقبل الطلب من params

  const t = (ar, en) => (isRTL ? ar : en);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>
        {item.name} × {item.quantity}
      </Text>
      {item.extras?.length > 0 && (
        <Text style={styles.itemExtras}>
          {t("الإضافات", "Extras")}: {item.extras.join(", ")}
        </Text>
      )}
      {item.note && (
        <Text style={styles.itemNote}>
          {t("ملاحظة", "Note")}: {item.note}
        </Text>
      )}
      <Text style={styles.itemPrice}>
        {item.price * item.quantity} {t("₪", "₪")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <AppHeader title={t("تفاصيل الطلب", "Order Details")} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("المتجر", "Store")}</Text>
        <Text style={styles.sectionText}>{order.storeName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("عنوان التوصيل", "Delivery Address")}</Text>
        <Text style={styles.sectionText}>{order.address}</Text>
      </View>

      <View style={styles.sectionRow}>
        <View style={styles.statusBox}>
          <Text style={styles.sectionTitle}>{t("الحالة", "Status")}</Text>
          <Text
            style={[
              styles.statusText,
              order.status === "completed"
                ? styles.statusCompleted
                : styles.statusPending,
            ]}
          >
            {t(
              order.status === "completed" ? "تم التسليم" : "قيد التنفيذ",
              order.status === "completed" ? "Completed" : "In Progress"
            )}
          </Text>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.sectionTitle}>{t("طريقة الدفع", "Payment")}</Text>
          <Text style={styles.sectionText}>
            {t(
              order.paymentMethod === "cash"
                ? "كاش"
                : order.paymentMethod === "card"
                ? "بطاقة"
                : "محفظة",
              order.paymentMethod
            )}
          </Text>
        </View>
      </View>

      <FlatList
        data={order.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("الملخص", "Summary")}</Text>
        <View style={styles.summaryRow}>
          <Text>{t("المجموع", "Subtotal")}</Text>
          <Text>{order.subtotal} ₪</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>{t("التوصيل", "Delivery")}</Text>
          <Text>{order.deliveryFee} ₪</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>{t("الإجمالي", "Total")}</Text>
          <Text style={styles.totalText}>{order.total} ₪</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDefault,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.card,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  statusBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.xs,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.card,
  },
  sectionTitle: {
    fontSize: FONTS.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionText: {
    fontSize: FONTS.sm,
    color: COLORS.mutedText,
  },
  statusText: {
    fontSize: FONTS.md,
    fontWeight: "700",
  },
  statusCompleted: {
    color: "green",
  },
  statusPending: {
    color: "orange",
  },
  itemCard: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.card,
  },
  itemName: {
    fontSize: FONTS.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  itemExtras: {
    fontSize: FONTS.sm,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  itemNote: {
    fontSize: FONTS.sm,
    color: COLORS.mutedText,
    marginTop: 2,
    fontStyle: "italic",
  },
  itemPrice: {
    fontSize: FONTS.md,
    fontWeight: "700",
    marginTop: 4,
    color: COLORS.primary,
  },
  listContainer: {
    padding: SPACING.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  totalText: {
    fontSize: FONTS.lg,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
