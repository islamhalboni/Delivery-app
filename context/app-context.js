import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCities } from "../services/stores-service";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState("ar");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);

  // ✅ تغيير اللغة بدون Reload
  const changeLanguage = async (lang) => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem("language", lang);
    } catch (e) {
      console.error("Error changing language:", e);
    }
  };

  const setUserData = async (userData, tokenData) => {
    if (userData && tokenData) {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", tokenData);
      setUser(userData);
      setToken(tokenData);
    }
  };

  const setCityData = async (city) => {
    if (city) {
      await AsyncStorage.setItem("city", JSON.stringify(city));
      setCity(city);
    }
  };

  const logoutUser = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ✅ تحميل البيانات المخزنة عند تشغيل التطبيق
  useEffect(() => {
    const loadData = async () => {
      try {
        // تحميل اللغة
        const storedLang = await AsyncStorage.getItem("language");
        if (storedLang) {
          setLanguage(storedLang);
        }

        // تحميل المستخدم
        const userData = await AsyncStorage.getItem("user").then((str) =>
          str ? JSON.parse(str) : null
        );
        const tokenData = await AsyncStorage.getItem("token");
        const city = await AsyncStorage.getItem("city").then((str) =>
          str ? JSON.parse(str) : null
        );

        if (userData && tokenData) {
          await setUserData(userData, tokenData);
        }
        if (city) {
          await setCityData(city);
        }
      } catch (e) {
        console.error("Error loading user:", e);
      }
    };

    const fetchCities = async () => {
      try {
        const res = await getCities();
        setCities(res.data);
        const stored = await AsyncStorage.getItem("city");
        if (!stored && Array.isArray(res.data) && res.data.length) {
          await setCityData(res.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCities();
    loadData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        cities,
        language,
        changeLanguage, // ✅ تستعمل هاي بس
        user,
        token,
        setUserData,
        logoutUser,
        city,
        setCityData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
