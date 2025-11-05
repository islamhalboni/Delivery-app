// components/StickyCartBar.js
import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrder } from '../context/orders-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../theme';

export default function StickyCartBar({ targetRoute = 'CartScreen' }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { orders = [] } = useOrder();

  const { count, total } = useMemo(() => {
    let c = 0;
    let t = 0;
    for (const line of orders) {
      const q = Number(line?.quantity) || 0;
      c += q;
      const lineTotal =
        line?.total != null
          ? Number(line.total)
          : (Number(line?.item?.price) || 0) * q;
      t += Number.isFinite(lineTotal) ? lineTotal : 0;
    }
    return { count: c, total: t };
  }, [orders]);

  const isVisible = count > 0 && total > 0;
  const slide = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: isVisible ? 0 : 80,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slide]);

  if (!isVisible) return null;

  const isRTL = I18nManager.isRTL;

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => navigation.navigate(targetRoute)}
      >
        <Animated.View
          style={[
            styles.bar,
            { transform: [{ translateY: slide }] },
            isRTL && { flexDirection: 'row-reverse' },
          ]}
        >
          <View style={[styles.totalBox, isRTL && { alignItems: 'flex-end' }]}>
            <Text style={styles.totalValue}>{total.toFixed(2)} ₪</Text>
            <Text style={styles.totalLabel}>{isRTL ? 'الإجمالي' : 'Total'}</Text>
          </View>

          <View style={[styles.btn, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons
              name="cart-outline"
              size={18}
              color={COLORS.white}
              style={{ marginEnd: 8 }}
            />
            <Text style={styles.btnText}>
              {isRTL ? 'عرض الطلبية' : 'View order'}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    paddingHorizontal: SPACING.md,
  },
  bar: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    ...SHADOWS.card,
    shadowOpacity: 0.12,
    elevation: 6,
  },
  totalBox: {
    flex: 1,
    alignItems: 'flex-start',
  },
  totalValue: {
    fontSize: FONTS.xl,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: FONTS.xl + 6,
  },
  totalLabel: {
    fontSize: FONTS.sm,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  btn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnText: {
    color: COLORS.white,
    fontSize: FONTS.lg,
    fontWeight: '800',
  },
  badge: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 6,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.accent,
    fontSize: FONTS.lg,
    fontWeight: '900',
    textAlign: 'center',
  },
});
