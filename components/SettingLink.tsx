import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SettingItem } from './SettingItem';

interface SettingLinkProps {
    label: string;
    href: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

export function SettingLink({ label, href, icon }: SettingLinkProps) {
    return (
        <SettingItem
            label={label}
            icon={icon}
            onPress={() => router.push(href as any)}
        />
    );
}
