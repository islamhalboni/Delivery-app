import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./auth-stack";
import TabBar from "./tab-bar";
import DrawerNavigator from "./drawer-navigator";

import AllStoresScreen from "../screens/public-pages/all-stores-screen";
import StoreDetailsScreen from "../screens/public-pages/store-details-screen";
import SearchScreen from "../screens/public-pages/categories-pages/search-screen";
import OrderDetailsScreen from "../screens/private-pages/order-details-screen";
import OrderProgressScreen from "../screens/private-pages/order-progress-screen";
import CartScreen from "../screens/private-pages/cart-screen"; // صفحة الطلب قيد التنفيذ
import ChooseCategoryScreen from "../screens/private-pages/choose-category-screen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} id="main-stack">
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} /> 
        <Stack.Screen name="TabBar" component={TabBar} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="allStoresScreen" component={AllStoresScreen} />
        <Stack.Screen  name="storeDetailsScreen"component={StoreDetailsScreen}/>
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="OrderProgress" component={OrderProgressScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="searchScreen" component={SearchScreen} />
        <Stack.Screen
          name="chooseCategoryScreen"
          component={ChooseCategoryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
