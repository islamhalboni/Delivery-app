import React, { useEffect, useState } from "react";
import AppNavigator from "./navigators/app-navigator";
import { AppProvider } from "./context/app-context";
import { OrderProvider } from "./context/orders-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Location from "expo-location";
import * as Font from "expo-font";
import { Text, TextInput } from "react-native";

console.log("🔍 Check imports:");
console.log("AppNavigator:", AppNavigator);
console.log("AppProvider:", AppProvider);
console.log("OrderProvider:", OrderProvider);
console.log("SafeAreaProvider:", SafeAreaProvider);

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          TajawalRegular: require("./assets/fonts/Tajawal-Regular.ttf"),
          TajawalBold: require("./assets/fonts/Tajawal-Bold.ttf"),
        });
        setFontsLoaded(true);

        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.style = { fontFamily: "TajawalRegular" };

        TextInput.defaultProps = TextInput.defaultProps || {};
        TextInput.defaultProps.style = { fontFamily: "TajawalRegular" };
      } catch (error) {
        console.log("❌ خطأ في تحميل الخطوط:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("❌ تم رفض إذن الموقع");
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        console.log("✅ الموقع الحالي:", loc.coords);
      } catch (error) {
        console.log("❌ خطأ في جلب الموقع:", error);
      }
    })();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <OrderProvider>
          <AppNavigator />
        </OrderProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
