import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

const CARD_WIDTH = 250;
const IMG_HEIGHT = 150;

export default function MenuItemCard({ item, language = 'ar', onPress, onAdd }) {
  // 🚨 لو الصنف مش active → ما يرجع أي UI
  if (!item.active) {
    return null;
  }

  const isRTL = language === 'ar';
  const title = isRTL ? item.name_ar || item.name : item.name_en || item.name;
  const price = Number(item.price) ? Number(item.price).toFixed(2) : item.price;
  const isAvailable = item.available === true;

  return (
    <TouchableOpacity
      activeOpacity={isAvailable ? 0.92 : 1}
      onPress={isAvailable ? onPress : null}
      style={styles.wrapper}
      accessibilityRole="button"
      disabled={!isAvailable}
    >
      <View style={styles.card}>
        {/* صورة + Gradient */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.25)']}
            style={styles.imageOverlay}
          />

          {/* سعر */}
          {isAvailable && (
            <View style={[styles.priceBadge, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="pricetag-outline" size={14} color={COLORS.accent} />
              <Text style={styles.priceText}>{price} ₪</Text>
            </View>
          )}
        </View>

        {/* المحتوى */}
        <View style={styles.content}>
          <View style={[styles.titleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text
              style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>

            {/* زر السلة أو مكانه محفوظ */}
            <View style={{ width: 42, height: 42 }}>
              {isAvailable && (
                <TouchableOpacity
                  style={styles.cartBtn}
                  onPress={onAdd || onPress}
                  activeOpacity={0.85}
                  accessibilityLabel={isRTL ? 'أضف إلى السلة' : 'Add to cart'}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons name="cart" size={18} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* طبقة غير متوفر */}
        {!isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>
              {isRTL ? 'غير متوفر' : 'Unavailable'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    position: 'relative',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: IMG_HEIGHT,
    backgroundColor: COLORS.bgLight,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  priceBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    elevation: 3,
  },
  priceText: {
    fontFamily: 'Tajawal',
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.accent,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  titleRow: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    flex: 1,
    fontFamily: 'Tajawal',
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    transform: [{ scale: 1 }],
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: 'Tajawal',
  },
});
