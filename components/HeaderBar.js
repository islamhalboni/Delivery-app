// components/HeaderBar.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; 
import { COLORS, FONTS, SPACING } from "../theme";

export default function HeaderBar({
  title = " اسكان روجيب",
  subtitle = "نابلس",
  onLocationPress,
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.navigate("searchScreen")}
      >
        <Ionicons name="search-outline" size={22} color={COLORS.text} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.location} onPress={onLocationPress}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
        <Text style={styles.subtitle}>{subtitle}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.getParent('RootDrawer')?.openDrawer()}
      >
        <Ionicons name="menu-outline" size={26} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50, 
    paddingBottom: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

    zIndex: 100,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    borderWidth: 2,
    borderColor: "#ededed",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.family.bold,
    color: COLORS.text,
    marginHorizontal: 4,
  },
  subtitle: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.family.regular,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  iconBtn: {
    padding: 4,
  },
});
