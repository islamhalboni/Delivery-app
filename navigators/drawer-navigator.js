import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Share,
  Linking,
  Alert,
  Pressable,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import Animated, { FadeInDown, FadeInLeft, ZoomIn } from "react-native-reanimated";
import { AppContext } from "../context/app-context";
import TabBar from "./tab-bar";
import AuthStack from "./auth-stack";
import { FONTS } from "../theme";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { user, setUser, changeLanguage } = useContext(AppContext);

  const handleLogout = () => {
    setUser(null);
    props.navigation.replace("AuthStack");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "جرّب تطبيقنا الآن 🚀",
      });
    } catch (error) {
      Alert.alert("خطأ", "تعذر مشاركة التطبيق");
    }
  };

  const handleContact = () => {
    Linking.openURL("mailto:support@example.com");
  };

  const handleLanguage = () => {
    Alert.alert("اختر اللغة", "يرجى اختيار اللغة المفضلة:", [
      { text: "English", onPress: () => changeLanguage("en") },
      { text: "العربية", onPress: () => changeLanguage("ar") },
      { text: "إلغاء", style: "cancel" },
    ]);
  };

  const menuItems = [
    { label: "🏠 الصفحة الرئيسية", action: () => props.navigation.navigate("TabBar") },
    { label: "📜 سياسة الخصوصية", action: () => Alert.alert("📜", "صفحة سياسة الخصوصية") },
    { label: "📑 شروط الاستخدام", action: () => Alert.alert("📑", "صفحة شروط الاستخدام") },
    { label: "🔗 مشاركة التطبيق", action: handleShare },
    { label: "📧 تواصل معنا", action: handleContact },
    { label: "🌐 تغيير اللغة", action: handleLanguage },
  ];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* 🟢 هيدر المستخدم مع انيميشن */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.userInfo}
      >
        <Text style={styles.userName}>{user?.name || "👤 مستخدم"}</Text>
        <Text style={styles.userPhone}>{user?.phone || "📞 بدون رقم"}</Text>
      </Animated.View>

      {/* 🟢 القائمة مع انيميشن لكل عنصر */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <Animated.View
            key={index}
            entering={FadeInLeft.delay(index * 120)}
          >
            <Pressable
              onPress={item.action}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      {/* 🟥 تسجيل الخروج بأسفل مع ZoomIn */}
      <Animated.View
        entering={ZoomIn.duration(500).delay(300)}
        style={styles.logoutSection}
      >
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { transform: [{ scale: 0.96 }] },
          ]}
        >
          <Text style={styles.logoutLabel}>🚪 تسجيل خروج</Text>
        </Pressable>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      id="RootDrawer"
      initialRouteName="TabBar"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#ffffff",
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          width: 300,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="TabBar" component={TabBar} />
      <Drawer.Screen name="AuthStack" component={AuthStack} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfo: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f5f6fa",
  },
  userName: {
    fontSize: FONTS.title + 6,
    fontFamily: FONTS.family.bold,
    color: "#222",
  },
  userPhone: {
    fontSize: FONTS.xl,
    fontFamily: FONTS.family.regular,
    color: "#555",
    marginTop: 8,
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemPressed: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  menuLabel: {
    fontSize: FONTS.xl + 2,
    fontFamily: FONTS.family.regular,
    color: "#333",
  },
  logoutSection: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    paddingBottom: 20,
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  logoutLabel: {
    color: "#e63946",
    fontSize: FONTS.xl + 4,
    fontFamily: FONTS.family.bold,
  },
});
