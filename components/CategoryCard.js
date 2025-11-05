import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../theme';

export default function CategoryCard({ id, title, imageSource, onPress }) {
  return (
    <TouchableOpacity style={styles.itemWrapper} onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.cardText}>{title}</Text>
      </View>
      <Image source={imageSource} style={styles.cardImage} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  card: {
    width: '92%',
    height: 90,
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    paddingStart: SPACING.lg,
    paddingEnd: SPACING.xl * 1.5,
    ...SHADOWS.card,
    alignSelf: 'center',
  },
  cardText: {
    fontSize: FONTS.md + 2,
    fontFamily: 'TajawalBold', 
    color: COLORS.text,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  cardImage: {
    width: 100,
    height: '100%',
    position: 'absolute',
    right: SPACING.lg,
    top: 0,
    bottom: 0,
  },
});
