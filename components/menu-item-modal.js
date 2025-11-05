// components/menu-item-modal.js
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from "../theme";
import { useOrder } from "../context/orders-context";

const toBool = (v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "1" || s === "true" || s === "yes" || s === "y" || s === "on";
  }
  return false;
};
const idStr = (v) => String(v ?? "");

export default function ItemModal({ item, onClose, onAddToCart }) {
  const isOpen = !!item;
  const { addToCart } = useOrder();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item?.id != null) {
      setCurrentStep(0);
      setSelectedAddons({});
      setQuantity(1);
    }
  }, [item?.id]);

  const steps = useMemo(() => {
    if (!item) return [];
    if (Array.isArray(item.steps) && item.steps.length) {
      return item.steps.map((s, idx) => ({
        id: idStr(s.id ?? `step-${idx}`),
        name: s.name ?? s.title ?? `خطوة ${idx + 1}`,
        multiple: toBool(s.multiple ?? s.is_multiple ?? s.multi),
        addons: Array.isArray(s.addons)
          ? s.addons.map((opt) => ({
              id: idStr(opt.id),
              name: opt.name_ar ?? opt.name ?? `خيار ${String(opt.id || "")}`,
              price: Number(opt.price) || 0,
            }))
          : [],
      }));
    }
    if (Array.isArray(item.addons) && item.addons.length) {
      return item.addons.map((g, idx) => ({
        id: idStr(g.id ?? `group-${idx}`),
        name: g.name_ar ?? g.name ?? `مجموعة ${idx + 1}`,
        multiple: toBool(g.multiple ?? g.is_multiple ?? g.multi),
        addons: Array.isArray(g.options)
          ? g.options.map((opt) => ({
              id: idStr(opt.id),
              name: opt.name_ar ?? opt.name ?? `خيار ${String(opt.id || "")}`,
              price: Number(opt.price) || 0,
            }))
          : [],
      }));
    }
    return [];
  }, [item]);

  useEffect(() => {
    setCurrentStep((s) =>
      steps.length ? Math.min(Math.max(0, s), steps.length - 1) : 0
    );
  }, [steps.length]);

  const basePrice = Number(item?.price) || 0;

  const addonsPriceSingleQty = useMemo(() => {
    let sum = 0;
    Object.values(selectedAddons).forEach((arr) => {
      if (Array.isArray(arr)) {
        sum += arr.reduce(
          (acc, a) => acc + (a?.price ? Number(a.price) || 0 : 0),
          0
        );
      }
    });
    return sum;
  }, [selectedAddons]);

  const totalPrice = (basePrice + addonsPriceSingleQty) * quantity;

  const formatPrice = (value) => {
    const n = Number(value) || 0;
    try {
      return new Intl.NumberFormat("ar-PS", {
        style: "currency",
        currency: "ILS",
        minimumFractionDigits: 2,
      }).format(n);
    } catch {
      return `${n.toFixed(2)}₪`;
    }
  };

  const handleSelectAddon = (stepObj, option) => {
    const groupKey = idStr(stepObj?.id ?? `g-${currentStep}`);
    const multiple = toBool(stepObj?.multiple);

    setSelectedAddons((prev) => {
      const current = Array.isArray(prev[groupKey]) ? prev[groupKey] : [];
      if (multiple) {
        const idx = current.findIndex((x) => idStr(x.id) === idStr(option.id));
        if (idx >= 0) {
          const copy = current.slice();
          copy.splice(idx, 1);
          return { ...prev, [groupKey]: copy };
        } else {
          return {
            ...prev,
            [groupKey]: [
              ...current,
              { id: idStr(option.id), name: option.name, price: option.price ?? 0 },
            ],
          };
        }
      } else {
        const already =
          current.length === 1 && idStr(current[0]?.id) === idStr(option.id);
        return {
          ...prev,
          [groupKey]: already
            ? []
            : [{ id: idStr(option.id), name: option.name, price: option.price ?? 0 }],
        };
      }
    });
  };

  const isLastStep = steps.length === 0 || currentStep === steps.length - 1;
  const stepObj = steps.length ? steps[currentStep] : null;
  const groupKey = stepObj ? idStr(stepObj.id) : "";
  const currentSelection = (groupKey && selectedAddons[groupKey]) || [];
  const canGoNext = true;

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet} key={item?.id}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">
              {item?.name_ar ?? item?.name ?? ""}
            </Text>
            <View style={{ width: 32 }} />
          </View>

          {!item ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loaderText}>...جاري التحميل</Text>
            </View>
          ) : (
            <>
              <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {!!item?.image && (
                  <View style={styles.imageWrap}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                  </View>
                )}

                <View style={styles.meta}>
                  <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {item?.name_ar ?? item?.name ?? ""}
                  </Text>

                  <View style={styles.priceQtyRow}>
                    <View style={styles.pricePill}>
                      <Ionicons name="pricetag" size={14} color={COLORS.white} />
                      <Text style={styles.pricePillText}>{formatPrice(basePrice)}</Text>
                    </View>

                    <View style={styles.qtyInline}>
                      <TouchableOpacity
                        onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                        style={styles.qtyInlineBtn}
                      >
                        <Ionicons name="remove" size={18} color={COLORS.text} />
                      </TouchableOpacity>
                      <Text style={styles.qtyInlineValue}>{quantity}</Text>
                      <TouchableOpacity
                        onPress={() => setQuantity((q) => q + 1)}
                        style={styles.qtyInlineBtn}
                      >
                        <Ionicons name="add" size={18} color={COLORS.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {steps.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {stepObj?.name ?? `خطوة ${currentStep + 1}`}
                    </Text>

                    {Array.isArray(stepObj?.addons) && stepObj.addons.length > 0 ? (
                      <View style={{ gap: SPACING.sm }}>
                        {stepObj.addons.map((opt) => {
                          const multiple = toBool(stepObj?.multiple);
                          const selected = currentSelection?.some(
                            (x) => idStr(x.id) === idStr(opt.id)
                          );
                          return (
                            <TouchableOpacity
                              key={opt.id}
                              style={[styles.optionCard, selected && styles.optionCardSelected]}
                              onPress={() => handleSelectAddon(stepObj, opt)}
                              activeOpacity={0.85}
                            >
                              <View style={styles.optionLeft}>
                                <Ionicons
                                  name={
                                    multiple
                                      ? selected
                                        ? "checkbox"
                                        : "square-outline"
                                      : selected
                                      ? "radio-button-on"
                                      : "radio-button-off"
                                  }
                                  size={18}
                                  color={selected ? COLORS.primary : COLORS.mutedText}
                                />
                                <Text style={styles.optionLabel} numberOfLines={2}>
                                  {opt.name}
                                </Text>
                              </View>
                              <Text style={styles.optionPrice}>
                                {formatPrice(opt?.price ?? 0)}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <Text style={styles.helperText}>لا توجد خيارات في هذه الخطوة.</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>لا توجد إضافات</Text>
                    <Text style={styles.helperText}>يمكنك إضافة المنتج مباشرة إلى السلة.</Text>
                  </View>
                )}

                <View style={styles.totalInline}>
                  <Text style={styles.totalInlineLabel}>الإجمالي</Text>
                  <Text style={styles.totalInlinePrice}>{formatPrice(totalPrice)}</Text>
                </View>

                <View style={{ height: 120 }} />
              </ScrollView>

              <View style={styles.footer}>
                {!isLastStep ? (
                  <TouchableOpacity
                    style={[styles.primaryBtn, !canGoNext && styles.navBtnDisabled]}
                    disabled={!canGoNext}
                    onPress={() =>
                      setCurrentStep((s) =>
                        Math.min(steps.length === 0 ? 0 : steps.length - 1, s + 1)
                      )
                    }
                  >
                    <Ionicons
                      name="arrow-back"
                      size={18}
                      color={COLORS.white}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.primaryBtnText}>التالي</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                      onAddToCart?.(item, quantity, selectedAddons);
                      onClose?.();
                    }}
                  >
                    <Text style={styles.addBtnText}>
                      {`أضف إلى السلة (${formatPrice(totalPrice)})`}
                    </Text>
                    <Ionicons name="cart" size={18} color={COLORS.white} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.navBtn,
                    (currentStep === 0 || steps.length === 0) && styles.navBtnDisabled,
                  ]}
                  disabled={currentStep === 0 || steps.length === 0}
                  onPress={() => setCurrentStep((s) => Math.max(0, s - 1))}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={
                      currentStep === 0 || steps.length === 0
                        ? COLORS.mutedText
                        : COLORS.text
                    }
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.navBtnText,
                      {
                        color:
                          currentStep === 0 || steps.length === 0
                            ? COLORS.mutedText
                            : COLORS.text,
                      },
                    ]}
                  >
                    رجوع
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.55)" },
  sheet: {
    width: "100%",
    maxHeight: "92%",
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    ...SHADOWS.card,
  },
  header: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FONTS.xl,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    flex: 1,
    fontFamily: "Tajawal-Bold",
  },
  loaderWrap: { padding: SPACING.xl, alignItems: "center", justifyContent: "center" },
  loaderText: { marginTop: 8, color: COLORS.mutedText, fontFamily: "Tajawal" },
  content: { paddingBottom: SPACING.xl },
  imageWrap: {
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    ...SHADOWS.card,
  },
  image: { width: "100%", height: 200 },
  meta: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, gap: 8 },
  title: { fontSize: FONTS.xl, fontWeight: "800", color: COLORS.text, fontFamily: "Tajawal-Bold" },
  priceQtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  pricePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 2,
  },
  pricePillText: { color: COLORS.white, fontWeight: "700", fontSize: FONTS.sm, fontFamily: "Tajawal" },
  qtyInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.bgLight,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginLeft: SPACING.md,
  },
  qtyInlineBtn: { width: 34, height: 34, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  qtyInlineValue: { minWidth: 28, textAlign: "center", fontSize: FONTS.lg, fontWeight: "800", color: COLORS.text, fontFamily: "Tajawal-Bold" },
  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  sectionTitle: { fontSize: FONTS.lg, fontWeight: "700", color: COLORS.text, marginBottom: SPACING.sm, fontFamily: "Tajawal-Bold" },
  optionCard: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgDefault,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...SHADOWS.card,
    marginBottom: SPACING.sm,
  },
  optionCardSelected: { borderColor: COLORS.primary, backgroundColor: "#fff9ec" },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, flex: 1 },
  optionLabel: { fontSize: FONTS.md, color: COLORS.text, flexShrink: 1, fontFamily: "Tajawal" },
  optionPrice: { fontSize: FONTS.md, color: COLORS.text, fontWeight: "700", marginStart: SPACING.md, fontFamily: "Tajawal-Bold" },
  helperText: { color: COLORS.mutedText, fontSize: FONTS.sm, marginTop: 4, fontFamily: "Tajawal" },
  totalInline: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalInlineLabel: { color: COLORS.mutedText, fontSize: FONTS.md, fontFamily: "Tajawal" },
  totalInlinePrice: { color: COLORS.text, fontSize: FONTS.xl, fontWeight: "800", fontFamily: "Tajawal-Bold" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  navBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.bgLight,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navBtnDisabled: { opacity: 0.5 },
  navBtnText: { fontWeight: "700", fontSize: FONTS.md, fontFamily: "Tajawal" },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 2,
  },
  primaryBtnText: { color: COLORS.white, fontWeight: "800", fontSize: FONTS.md, fontFamily: "Tajawal-Bold" },
  addBtn: {
    backgroundColor: COLORS.accent || COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  addBtnText: { color: COLORS.white, fontWeight: "800", fontSize: FONTS.md, fontFamily: "Tajawal-Bold" },
});
