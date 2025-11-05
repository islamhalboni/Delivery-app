
import React, { useContext, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import OrderCard from '../../components/OrderCard';
import { AppContext } from '../../context/app-context';
import { COLORS, SPACING, FONTS } from '../../theme';
import StickyOrderBanner from "../../components/StickyOrderBanner";

export default function MyOrdersScreen() {
  const { language } = useContext(AppContext);
  const isRTL = language === 'ar';
  const navigation = useNavigation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('https://your-api.com/users/me/orders');
        // Handle 404 (no orders) as an empty list
        if (response.status === 404) {
          setOrders([]);
          return;
        }
        // If other error status, throw to catch
        if (!response.ok) {
          throw new Error(`Fetch failed: ${response.status}`);
        }
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        // Silently handle errors and show no orders
        console.warn('Could not fetch orders, showing empty state.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <AppHeader />
        <View style={styles.loaderContainer} pointerEvents="none">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <AppHeader />

      {orders.length === 0 ? (
        <View style={styles.centered} pointerEvents="none">
          <Text style={styles.emptyText}>
            {isRTL ? 'لا يوجد أي طلبات سابقة' : 'No previous orders.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPressDetails={() =>
                navigation.navigate(
                  item.status === 'completed' ? 'OrderDetails' : 'OrderProgress',
                  { orderId: item.id }
                )
              }
            />
          )}
        />
      )}
      <StickyOrderBanner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDefault,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SPACING.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  emptyText: {
    color: COLORS.mutedText,
    fontSize: FONTS.md,
    textAlign: 'center',
  },
});
