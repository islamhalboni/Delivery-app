import React, {useContext} from 'react';
import {StyleSheet, Text} from 'react-native';
import AppHeader from "../../components/AppHeader";
import {AppContext} from "../../context/app-context";
import StickyOrderBanner from "../../components/StickyOrderBanner";
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FONTS} from "../../theme";

export default function ProfileScreen() {
    const {user} = useContext(AppContext);
    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
            <AppHeader/>
            <Text style={styles.profileText}>This is the Profile Screen</Text>
            <StickyOrderBanner/>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.bgDefault,
    },
    profileText: {
        fontFamily: FONTS.family.regular,
        fontSize: FONTS.md,
        color: COLORS.text,
    }
})
