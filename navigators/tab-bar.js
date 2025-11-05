import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CategoriesScreen from '../screens/public-pages/categories-pages/categories-screen';
import RestaurantsScreen from '../screens/public-pages/categories-pages/restaurants-screen';
import ProfileScreen from '../screens/private-pages/profile-screen';
import MyOrdersScreen from '../screens/private-pages/my-orders-screen';

import { AppContext } from '../context/app-context';
import { COLORS, FONTS } from '../theme';

const Tab = createBottomTabNavigator();

export default function TabBar() {
  const { user, token, language } = useContext(AppContext);
  const insets = useSafeAreaInsets();

  // ✅ Debug logs
  console.log("✅ CategoriesScreen:", CategoriesScreen);
  console.log("✅ RestaurantsScreen:", RestaurantsScreen);
  console.log("✅ ProfileScreen:", ProfileScreen);
  console.log("✅ MyOrdersScreen:", MyOrdersScreen);

  const getLabel = (routeName) => {
    if (routeName === 'Categories')
      return language === 'ar' ? 'المتاجر' : 'Stores';
    if (routeName === 'Profile')
      return language === 'ar' ? 'الصفحة الشخصية' : 'Profile';
    if (routeName === 'Restaurants')
      return language === 'ar' ? 'المطاعم' : 'Restaurants';
    if (routeName === 'My Orders')
      return language === 'ar' ? 'طلباتي' : 'My Orders';
    return routeName;
  };

  return (
    <Tab.Navigator
      initialRouteName="Categories"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 50 + insets.bottom,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: COLORS.white,
          position: 'absolute',
          paddingBottom: insets.bottom || 10,
          paddingTop: 5,
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              fontSize: FONTS.sm,
              fontWeight: focused ? '700' : '500',
              color: focused ? COLORS.primary : COLORS.mutedText,
              writingDirection: language === 'ar' ? 'rtl' : 'ltr',
              textAlign: 'center',
            }}
          >
            {getLabel(route.name)}
          </Text>
        ),
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Restaurants') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'My Orders') {
            iconName = focused ? 'cart' : 'cart-outline';
          }
          return (
            <Ionicons
              name={iconName}
              size={22}
              color={focused ? COLORS.primary : COLORS.mutedText}
            />
          );
        },
      })}
      id={'navigator'}
    >
      {language === 'ar' ? (
        <>
          <Tab.Screen name="Categories" component={CategoriesScreen} />
          <Tab.Screen name="Restaurants" component={RestaurantsScreen} />
          {user && token && (
            <Tab.Screen name="My Orders" component={MyOrdersScreen} />
          )}
          {user && token && (
            <Tab.Screen name="Profile" component={ProfileScreen} />
          )}
        </>
      ) : (
        <>
          {user && token && (
            <Tab.Screen name="Profile" component={ProfileScreen} />
          )}
          {user && token && (
            <Tab.Screen name="My Orders" component={MyOrdersScreen} />
          )}
          <Tab.Screen name="Restaurants" component={RestaurantsScreen} />
          <Tab.Screen name="Categories" component={CategoriesScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}
