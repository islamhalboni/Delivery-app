import React, { useContext } from 'react';
import CategoryListScreen from './base-screen';
import { getRestaurantsTypes } from '../../../services/restaurants-service';
import { FONTS } from '../../../theme';
import { AppContext } from '../../../context/app-context';

export default function RestaurantsScreen() {
  const { language } = useContext(AppContext);
  const isRTL = language === 'ar';

  return (
    <CategoryListScreen
      title={isRTL ? "المطاعم" : "Restaurants"}
      subtitle={
        isRTL
          ? "استكشف المطاعم المتوفرة حسب نوعها"
          : "Explore available restaurants by type"
      }
      searchPlaceholder={isRTL ? "بحث عن مطعم..." : "Search restaurant..."}
      fetchFunction={getRestaurantsTypes}
      categoryRoute="CategoryRestaurants"
      isStore={false}
      titleStyle={{
        fontFamily: FONTS.family.bold,
        textAlign: isRTL ? 'right' : 'left',
      }}
      subtitleStyle={{
        fontFamily: FONTS.family.regular,
        textAlign: isRTL ? 'right' : 'left',
      }}
      searchInputStyle={{
        fontFamily: FONTS.family.regular,
        textAlign: isRTL ? 'right' : 'left',
      }}
    />
  );
}
