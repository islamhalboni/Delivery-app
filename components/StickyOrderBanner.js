// components/StickyOrderBanner.jsx
import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
} from 'react-native';
import { useOrder } from '../context/orders-context';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/app-context';
import { COLORS, SPACING, FONTS, RADIUS, SHADOWS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function StickyOrderBanner() {
    const { store, orders, clearCart } = useOrder();
    const { language } = useContext(AppContext);
    const isRTL = language === 'ar';
    const navigation = useNavigation();

    if (!store || orders.length === 0) return null;

    const confirmCancel = () => {
        Alert.alert(
            isRTL ? 'إلغاء الطلب' : 'Cancel Order',
            isRTL
                ? 'هل أنت متأكد أنك تريد إلغاء الطلب؟'
                : 'Are you sure you want to cancel the order?',
            [
                { text: isRTL ? 'لا' : 'No', style: 'cancel' },
                { text: isRTL ? 'نعم' : 'Yes', onPress: clearCart, style: 'destructive' },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.banner,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
            >
                {/* شعار المتجر */}
                <Image
                    source={{ uri: store.logo_url }}
                    style={styles.logo}
                />

                {/* نص الرسالة */}
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text
                        style={[
                            styles.message,
                            { textAlign: isRTL ? 'right' : 'left' },
                        ]}
                    >
                        {isRTL ? (
                            <>لديك طلب <Text style={{ color: COLORS.primary }}>غير مكتمل</Text> من {store.name}</>
                        ) : (
                            <>You have an <Text style={{ color: COLORS.primary }}>unfinished</Text> order from {store.name}</>
                        )}
                    </Text>
                </View>

                {/* أزرار */}
                <View
                    style={[
                        styles.actions,
                        { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    ]}
                >
                    <TouchableOpacity style={styles.circleBtn} onPress={confirmCancel}>
                        <Ionicons name="close" size={22} color={COLORS.accent} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.circleBtn}
                        onPress={() => navigation.navigate('CartScreen')}
                    >
                        <Ionicons name="cart-outline" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 120 : 100,
        left: 16,
        right: 16,
        zIndex: 100,
        elevation: 10,
    },
    banner: {
        backgroundColor: COLORS.bgLight,
        padding: SPACING.sm,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        ...SHADOWS.card, // 👈 يضيف ظل أنيق
    },
    logo: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.white,
        marginHorizontal: 6,
    },
    message: {
        fontSize: FONTS.sm,
        fontWeight: '600',
        color: COLORS.text,
    },
    actions: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        ...SHADOWS.button, // 👈 ظل خفيف للأزرار
    },
});
