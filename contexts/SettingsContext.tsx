import * as settingsService from '@/services/settingsService';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Settings {
    theme: 'light' | 'dark' | 'system';
    currency: string;
    dateFormat: string;
    defaultAccountId: number | null;
    firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
}

// Default settings
const DEFAULT_SETTINGS: Settings = {
    theme: 'system',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    defaultAccountId: null,
    firstDayOfWeek: 0,
};

interface SettingsContextType {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    resetSettings: () => void;
    loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        try {
            const persistedSettings = settingsService.getAllSettings();

            // Parse settings ensuring types are correct
            const parsedSettings: Settings = { ...DEFAULT_SETTINGS };

            if (persistedSettings.theme) parsedSettings.theme = persistedSettings.theme as any;
            if (persistedSettings.currency) parsedSettings.currency = persistedSettings.currency;
            if (persistedSettings.dateFormat) parsedSettings.dateFormat = persistedSettings.dateFormat;
            if (persistedSettings.defaultAccountId && persistedSettings.defaultAccountId !== '') {
                parsedSettings.defaultAccountId = Number(persistedSettings.defaultAccountId);
            }
            if (persistedSettings.firstDayOfWeek) parsedSettings.firstDayOfWeek = Number(persistedSettings.firstDayOfWeek);

            setSettingsState(parsedSettings);
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        // Update state immediately
        setSettingsState(prev => ({ ...prev, [key]: value }));

        // Persist to DB
        const stringValue = value === null ? '' : String(value);
        settingsService.setSetting(key, stringValue);
    };

    const resetSettings = () => {
        settingsService.resetSettings();
        setSettingsState(DEFAULT_SETTINGS);
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
