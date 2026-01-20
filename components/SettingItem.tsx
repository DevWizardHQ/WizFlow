import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SettingItemProps {
    label: string;
    value?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    style?: ViewStyle;
}

export function SettingItem({ label, value, icon, onPress, rightElement, style }: SettingItemProps) {
    const textColor = useThemeColor({}, 'text');

    const content = (
        <View style={[styles.container, style]}>
            <View style={styles.left}>
                {icon && <Ionicons name={icon} size={22} color={textColor} style={styles.icon} />}
                <ThemedText type="default">{label}</ThemedText>
            </View>

            <View style={styles.right}>
                {value && <ThemedText type="default" style={styles.value}>{value}</ThemedText>}
                {rightElement}
                {onPress && !rightElement && (
                    <Ionicons name="chevron-forward" size={20} color={textColor} style={styles.chevron} />
                )}
            </View>
        </View>
    );

    if (onPress) {
        return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(128, 128, 128, 0.2)',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
        width: 24, // Fixed width for alignment
        textAlign: 'center',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        opacity: 0.6,
        marginRight: 8,
    },
    chevron: {
        opacity: 0.4,
    }
});
