/**
 * Below are the colors that are used in the app.
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF6B6B';
const tintColorDark = '#FF8E8E';

export const Colors = {
  light: {
    text: '#1a1a1a',
    background: '#FFF9F5',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#C4B5A8',
    tabIconSelected: tintColorLight,

    // Brand colors available in light mode
    coral: '#FF6B6B',
    coralLight: '#FFE8E4',
    coralSoft: '#FFF0EB',
    textSecondary: '#777',
    textMuted: '#999',
    white: '#ffffff',
    border: '#f0e6e0',
    success: '#4ADE80',
    warning: '#FBBF24',
    dark: '#1C1C1E',
    gold: '#FFD700',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // Brand colors available in dark mode
    coral: '#FF8E8E',
    coralLight: '#3D2A2A',
    coralSoft: '#2A2222',
    textSecondary: '#A0A0A0',
    textMuted: '#777',
    white: '#1C1C1E',
    border: '#333',
    success: '#4ADE80',
    warning: '#FBBF24',
    dark: '#000000',
    gold: '#FFD700',
  },
};

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});