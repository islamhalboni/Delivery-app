// components/StoreCard.jsx
import React, { useContext } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../theme';
import { AppContext } from '../context/app-context';

const StoreCard = ({ restaurant, onPress }) => {
  const { language } = useContext(AppContext);
  const isRTL = language === 'ar';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* لوجو داخل دايرة */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: restaurant.logo_url }} style={styles.image} />
      </View>

      {/* اسم المطعم */}
      <Text
        numberOfLines={1}
        style={[
          styles.name,
          { textAlign: isRTL ? 'right' : 'left' }, // 👈 يراعي RTL / LTR
        ]}
      >
        {restaurant.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    margin: 10,
    width: 150,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  imageWrap: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    backgroundColor: COLORS.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'Tajawal',
    marginTop: 2,
    width: '100%', // عشان النص يلتزم بالـ textAlign
  },
});

export default StoreCard;
