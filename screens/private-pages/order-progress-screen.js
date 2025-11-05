import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, ActivityIndicator, I18nManager } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/app-context';
import { COLORS, FONTS, SPACING } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function OrderProgressScreen() {
  const { language } = useContext(AppContext);
  const isRTL = language === 'ar';

  // حماية params
  const route = useRoute();
  const { orderId } = route.params || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تحديث الاتجاه للنظام (RTL/LTR)
    I18nManager.forceRTL(isRTL);

    // إذا مفيش orderId وقف
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const response = await fetch(`https://your-api.com/orders/${orderId}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, isRTL]);

  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // حالة مافي orderId
  if (!orderId) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
            {isRTL ? 'رقم الطلب غير متوفر' : 'Order ID not provided.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order || Object.keys(order).length === 0) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <Text style={[styles.emptyText, isRTL && styles.textRTL]}>
            {isRTL ? 'لا يوجد طلب' : 'No order found.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentStep = order.progress;
  const steps = [
    { key: 1, label: isRTL ? 'تم إرسال الطلب' : 'Order Placed' },
    { key: 2, label: isRTL ? 'قيد التحضير' : 'Preparing' },
    { key: 3, label: isRTL ? 'في الطريق إليك' : 'On the Way' },
    { key: 4, label: isRTL ? 'تم التوصيل' : 'Delivered' },
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isRTL ? styles.rtlDirection : styles.ltrDirection,
        ]}
      >
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {isRTL ? 'حالة الطلب' : 'Order Status'}
        </Text>
        <View style={styles.stepper}>
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <View style={styles.stepContainer}>
                <View
                  style={[
                    styles.circle,
                    step.key <= currentStep
                      ? styles.circleActive
                      : styles.circleInactive,
                  ]}
                >
                  <Text style={styles.circleText}>{step.key}</Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step.key <= currentStep
                      ? styles.stepLabelActive
                      : styles.stepLabelInactive,
                    isRTL && styles.textRTL,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    step.key < currentStep
                      ? styles.connectorActive
                      : styles.connectorInactive,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
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
  emptyText: {
    color: COLORS.mutedText,
    fontSize: FONTS.md,
    fontFamily: FONTS.family?.regular || 'System',
  },
  container: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.5,
  },
  rtlDirection: {
    direction: 'rtl',
  },
  ltrDirection: {
    direction: 'ltr',
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  title: {
    fontSize: FONTS.xl + 4,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontFamily: FONTS.family?.bold || 'System',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  stepContainer: {
    alignItems: 'center',
    width: width / 5,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  circleInactive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.mutedText,
  },
  circleText: {
    color: COLORS.white,
    fontSize: FONTS.md,
    fontWeight: '600',
    fontFamily: FONTS.family?.bold || 'System',
  },
  connector: {
    height: 2,
    flex: 1,
    marginHorizontal: -SPACING.sm,
  },
  connectorActive: {
    backgroundColor: COLORS.primary,
  },
  connectorInactive: {
    backgroundColor: COLORS.mutedText,
  },
  stepLabel: {
    marginTop: SPACING.sm,
    fontSize: FONTS.sm,
    textAlign: 'center',
    fontFamily: FONTS.family?.regular || 'System',
  },
  stepLabelActive: {
    color: COLORS.text,
    fontWeight: '600',
    fontFamily: FONTS.family?.bold || 'System',
  },
  stepLabelInactive: {
    color: COLORS.mutedText,
    fontFamily: FONTS.family?.regular || 'System',
  },
});
