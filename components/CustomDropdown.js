import React, {useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS, FONTS, RADIUS, SPACING} from '../theme';

export default function CustomDropdown({
                                           setModalOpen,
                                           isOpen,
                                           items = [],
                                           selected,
                                           onSelect,
                                           placeholder = 'اختر'
                                       }) {

    const handleSelect = (item) => {
        onSelect(item);
        setModalOpen(false);
    };

    return (
        <View>
            {/* Dropdown Trigger */}
            <TouchableOpacity style={styles.dropdown} onPress={() => setModalOpen(true)}>
                <Text style={styles.selectedText}>
                    {selected?.name_ar || placeholder}
                </Text>
                <Ionicons name="location-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>

            {/* Modal List */}
            <Modal visible={isOpen} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPressOut={() => setModalOpen(false)}
                >
                    <View style={styles.modalBox}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    style={styles.item}
                                >
                                    <Text style={styles.itemText}>{item.name_ar}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.bgLight,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        height: 44,
        borderWidth: 0,
    },
    selectedText: {
        fontSize: FONTS.md,
        color: COLORS.text,
        writingDirection: 'rtl',
        fontFamily: FONTS.family.regular, // 👈 خط Tajawal Regular
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
    },
    modalBox: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        width: '100%',
        maxHeight: 300,
        paddingVertical: SPACING.sm,
    },
    item: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
    },
    itemText: {
        fontSize: FONTS.md,
        color: COLORS.text,
        writingDirection: 'rtl',
        textAlign: 'right',
        fontFamily: FONTS.family.regular, // 👈 خط Tajawal Regular
    },
});
