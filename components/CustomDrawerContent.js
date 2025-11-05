// components/CustomDrawerContent.js
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SPACING } from "../theme";

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }} // صورة بروفايل عشوائية
          style={styles.avatar}
        />
        <Text style={styles.name}>أهلا، إسلام</Text>
        <Text style={styles.email}>islam@email.com</Text>
      </View>

      {/* Links */}
      <View style={styles.links}>
        <DrawerItem
          label="🏠 الرئيسية"
          labelStyle={styles.linkText}
          onPress={() => props.navigation.navigate("allStoresScreen")}
        />
        <DrawerItem
          label="🍔 مطعمي"
          labelStyle={styles.linkText}
          onPress={() => props.navigation.navigate("storeDetailsScreen")}
        />
      </View>

      {/* Footer / Logout */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => alert("تسجيل الخروج")}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: SPACING.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.family.bold,
    color: COLORS.text,
  },
  email: {
    fontSize: FONTS.sm,
    color: COLORS.textLight,
  },
  links: {
    marginTop: SPACING.md,
  },
  linkText: {
    fontSize: FONTS.md,
    fontFamily: FONTS.family.regular,
  },
  footer: {
    marginTop: "auto",
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONTS.md,
    fontFamily: FONTS.family.bold,
    marginLeft: 6,
  },
});
