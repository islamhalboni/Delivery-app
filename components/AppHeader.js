import React, { useContext, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackActions, useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/app-context';
import { useOrder } from '../context/orders-context'; // ✅ Correct import
import { COLORS, FONTS, SPACING } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7;

export default function AppHeader() {
    const navigation = useNavigation();
    const { user, token, logoutUser } = useContext(AppContext);
    const { orders } = useOrder(); // ✅ Get orders from correct context
    const isLoggedIn = user && token;

    const [menuOpen, setMenuOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    const openMenu = () => {
        setMenuOpen(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0.4,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const closeMenu = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -SIDEBAR_WIDTH,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start(() => setMenuOpen(false));
    };

    return (
        <>
            <View style={styles.container}>
                {/* Left: Menu Icon */}
                {isLoggedIn ? (
                    <TouchableOpacity onPress={openMenu}>
                        <Ionicons name="menu-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}

                {/* Center: Logo */}
                <Text style={styles.logo}>Logo</Text>

                {/* Right: Icons */}
                <View style={styles.rightIcons}>
                    {isLoggedIn ? (
                        <>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('CartScreen')}
                                style={styles.cartIcon}
                            >
                                <Ionicons name="bag-outline" size={22} color={COLORS.text} />
                                {orders && orders.length > 0 && <View style={styles.dot} />}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('AuthStack'))}>
                            <Text style={styles.loginBtn}>تسجيل الدخول</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Overlay + Sidebar */}
            {menuOpen && (
                <>
                    <TouchableWithoutFeedback onPress={closeMenu}>
                        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
                    </TouchableWithoutFeedback>

                    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                        <TouchableOpacity onPress={() => { logoutUser(); closeMenu(); }}>
                            <Text style={styles.menuItem}>تسجيل الخروج</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
        backgroundColor: COLORS.bgDefault,
        zIndex: 100,
    },
    logo: {
        fontSize: FONTS.lg,
        fontWeight: '700',
        color: COLORS.text,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartIcon: {
        marginLeft: SPACING.md,
        position: 'relative',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.accent,
        position: 'absolute',
        top: -2,
        right: -2,
    },
    loginBtn: {
        fontSize: FONTS.md,
        color: COLORS.accent,
        fontWeight: '600',
    },
    overlay: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.black,
        zIndex: 99,
    },
    sidebar: {
        position: 'absolute',
        top: 60,
        left: 0,
        width: SIDEBAR_WIDTH,
        bottom: 0,
        backgroundColor: COLORS.white,
        padding: SPACING.lg,
        zIndex: 100,
    },
    menuItem: {
        fontSize: FONTS.md,
        color: COLORS.accent,
        marginBottom: SPACING.md,
    },
});
