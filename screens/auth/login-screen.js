import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StackActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { AppContext } from "../../context/app-context";
import { COLORS, RADIUS, SPACING, SIZES, SHADOWS, FONTS } from "../../theme";
import { login, register } from "../../services/auth-service";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    paddingBottom: 40,
  },
  illustration: {
    width: 220,
    height: 220,
    marginBottom: 25,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
    color: COLORS.text,
    textAlign: "center",
    fontFamily: "Tajawal-Bold",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.mutedText,
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Tajawal-Regular",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: "#f9f9f9",
    height: SIZES.inputHeight,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
    width: "100%",
  },
  icon: {
    marginRight: SPACING.sm,
    color: COLORS.accent,
  },
  textInput: {
    flex: 1,
    fontSize: FONTS.md,
    color: COLORS.text,
    fontFamily: "Tajawal-Regular",
  },
  forgotTxt: {
    fontSize: FONTS.sm,
    color: COLORS.accent,
    fontWeight: "600",
    marginTop: 6,
    alignSelf: "flex-end",
    fontFamily: "Tajawal-Regular",
  },
  loginBtnWrapper: {
    width: "100%",
    marginTop: SPACING.lg,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    ...SHADOWS.button,
  },
  loginBtn: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  loginTxt: {
    color: COLORS.white,
    fontSize: FONTS.lg,
    fontWeight: "700",
    fontFamily: "Tajawal-Bold",
  },
  footerText: {
    marginTop: SPACING.lg,
    color: COLORS.text,
    fontSize: FONTS.md,
    textAlign: "center",
    fontFamily: "Tajawal-Regular",
  },
  link: {
    color: COLORS.accent,
    fontWeight: "700",
    fontFamily: "Tajawal-Bold",
  },
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const loading = false;
  const { user, setUserData } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      navigation.navigate("TabBar", { screen: "Home" });
    }
  }, [user]);

  const handleLogin = async (phone, password) => {
    try {
      const res = await login(phone, password);
      const user = res.user;
      const token = res.token;
      setUserData(user, token);
      navigation.dispatch(StackActions.replace("TabBar"));
    } catch (err) {
      alert(err.message || "فشل في تسجيل الدخول");
    }
  };

  const handleSubmit = async () => {
    const { name, phone, password, confirmPassword } = formData;
    if (!phone || !password) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    if (isRegister) {
      if (!name || !confirmPassword) {
        alert("يرجى ملء جميع الحقول");
        return;
      }
      if (password !== confirmPassword) {
        alert("كلمة المرور غير متطابقة");
        return;
      }
      try {
        await register(name, phone, password);
        alert("تم التسجيل بنجاح");
        await handleLogin(phone, password);
      } catch (err) {
        alert(err.message || "فشل في التسجيل");
      }
    } else {
      await handleLogin(phone, password);
    }
  };

  const handleFieldChange = (fieldName, value) =>
    setFormData({ ...formData, [fieldName]: value });

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {!isRegister ? (
            <Image source={require("../../assets/scooter.png")} style={styles.illustration}/>
          ) : (
            <Image source={require("../../assets/scooter2.png")} style={styles.illustration}/>
          )}

          <Text style={styles.title}>
            {isRegister ? "لنبدأ الآن" : "مرحباً بعودتك"}
          </Text>
          <Text style={styles.subtitle}>
            {isRegister ? "إنشاء حساب جديد" : "سجل دخولك لحسابك"}
          </Text>

          {isRegister && (
            <View style={styles.inputField}>
              <Ionicons name="person-outline" size={20} style={styles.icon} />
              <TextInput
                placeholder="الإسم الكامل"
                placeholderTextColor="#aaa"
                style={styles.textInput}
                value={formData.name}
                onChangeText={(v) => handleFieldChange("name", v)}
              />
            </View>
          )}
          <View style={styles.inputField}>
            <Ionicons name="call-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="رقم الهاتف"
              placeholderTextColor="#aaa"
              style={styles.textInput}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(v) => handleFieldChange("phone", v)}
            />
          </View>
          <View style={styles.inputField}>
            <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="كلمة المرور"
              placeholderTextColor="#aaa"
              secureTextEntry
              autoComplete="off"
              autoCorrect={false}
              textContentType="none"
              style={styles.textInput}
              value={formData.password}
              onChangeText={(v) => handleFieldChange("password", v)}
            />
          </View>
          {isRegister && (
            <View style={styles.inputField}>
              <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
              <TextInput
                placeholder="تأكيد كلمة المرور"
                placeholderTextColor="#aaa"
                secureTextEntry
                style={styles.textInput}
                value={formData.confirmPassword}
                onChangeText={(v) => handleFieldChange("confirmPassword", v)}
              />
            </View>
          )}

          {!isRegister && (
            <TouchableOpacity onPress={() => navigation.navigate("ForgetPasswordScreen")}>
              <Text style={styles.forgotTxt}>هل نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
          )}

          <View style={styles.loginBtnWrapper}>
            <TouchableOpacity onPress={handleSubmit} disabled={loading}>
              <LinearGradient
                colors={["#fc5600", "#efc023"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginBtn}
              >
                <Text style={styles.loginTxt}>
                  {loading ? "...جاري الإرسال" : isRegister ? "إنشاء حساب" : "تسجيل الدخول"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            {isRegister ? "لديك حساب؟ " : "ليس لديك حساب؟ "}
            <Text style={styles.link} onPress={() => setIsRegister(!isRegister)}>
              {isRegister ? "تسجيل الدخول" : "إنشاء حساب"}
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
