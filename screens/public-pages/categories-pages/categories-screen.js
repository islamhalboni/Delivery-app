import React, { useContext } from 'react';
import CategoryListScreen from './base-screen';
import { getStoresTypes } from '../../../services/stores-service';
import { FONTS } from '../../../theme';
import { AppContext } from '../../../context/app-context';

export default function CategoriesScreen() {
  const { language } = useContext(AppContext);
  const isRTL = language === 'ar';

  return (
    <CategoryListScreen
      title={isRTL ? "تصنيفات المتاجر" : "Store Categories"}
      subtitle={
        isRTL
          ? "استعرض المتاجر ضمن كل تصنيف"
          : "Browse stores by category"
      }
      searchPlaceholder={isRTL ? "بحث عن تصنيف..." : "Search category..."}
      fetchFunction={getStoresTypes}
      categoryRoute="Stores"
      isStore={true}
      // ضبط الخط حسب اللغة
      titleStyle={{
        fontFamily: isRTL ? FONTS.family.bold : FONTS.family.bold,
        textAlign: isRTL ? 'right' : 'left',
      }}
      subtitleStyle={{
        fontFamily: isRTL ? FONTS.family.regular : FONTS.family.regular,
        textAlign: isRTL ? 'right' : 'left',
      }}
      searchInputStyle={{
        fontFamily: isRTL ? FONTS.family.regular : FONTS.family.regular,
        textAlign: isRTL ? 'right' : 'left',
      }}
    />
  );
}
