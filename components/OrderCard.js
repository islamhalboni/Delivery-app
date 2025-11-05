import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/app-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

// dummy data for preview if no order passed
const dummyOrder = {
  id: 123,
  date: '2025-08-01T14:30:00Z',
  status: 'in_progress',
  store: {
    name_en: 'Demo Store',
    name_ar: 'متجر تجريبي',
    imageUrl: require('../assets/dessert.png'),
  },
};

export default function OrderCard({ order, onPressDetails }) {
  const { language } = useContext(AppContext);
  const isRTL = language === 'ar';
  const data = order || dummyOrder;

  const imgSource = data.store?.imageUrl
    ? typeof data.store.imageUrl === 'string'
      ? { uri: data.store.imageUrl }
      : data.store.imageUrl
    : require('../assets/dessert.png');

  const formattedDate = new Date(data.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const status = data.status;
  const statusLabel =
    status === 'in_progress'
      ? isRTL
        ? 'قيد التنفيذ'
        : 'In Progress'
      : isRTL
      ? 'مكتمل'
      : 'Completed';

  const badgeColor = status === 'in_progress' ? COLORS.warning : COLORS.success;

  return (
    <View
      style={[
        styles.card,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      <View
        style={[
          styles.badgeContainer,
          {
            backgroundColor: badgeColor,
            top: SPACING.xs,
            [isRTL ? 'left' : 'right']: SPACING.xs,
          },
        ]}
      >
        <Text style={styles.statusText}>{statusLabel}</Text>
      </View>

      <Image
        source={imgSource}
        style={[
          styles.storeImage,
          isRTL ? { marginLeft: SPACING.md, marginRight: 0 } : { marginRight: SPACING.md, marginLeft: 0 }
        ]}
      />

      <View style={styles.info}>
        <Text style={styles.orderNumber}>#{data.id}</Text>
        <Text style={styles.storeName} numberOfLines={1} ellipsizeMode="tail">
          {isRTL ? data.store.name_ar : data.store.name_en}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      <TouchableOpacity style={styles.detailsBtn} onPress={onPressDetails}>
        <Ionicons
          name="eye-outline"
          size={18}
          color={COLORS.white}
          style={isRTL ? { marginLeft: SPACING.xs } : { marginRight: SPACING.xs }}
        />
        <Text style={styles.detailsText}>
          {isRTL ? 'عرض التفاصيل' : 'Details'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'visible',
  },
  badgeContainer: {
    position: 'absolute',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 3,
  },
  statusText: {
    fontSize: FONTS.xs,
    color: COLORS.text,
    fontWeight: '700',
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
  },
  info: {
    flex: 1,
  },
  orderNumber: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  storeName: {
    fontSize: FONTS.sm,
    color: COLORS.mutedText,
  },
  date: {
    fontSize: FONTS.xs,
    color: COLORS.mutedText,
    marginTop: SPACING.xs / 2,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  detailsText: {
    fontSize: FONTS.sm,
    color: COLORS.white,
  },
});
