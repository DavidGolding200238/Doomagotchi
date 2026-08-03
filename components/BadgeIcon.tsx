import Svg, { Circle, Path } from 'react-native-svg';

type BadgeType = 'sun' | 'focus' | 'sleep' | 'book';

type Props = {
  size?: number;
  type: BadgeType;
};

const COLORS: Record<BadgeType, { main: string; dark: string }> = {
  sun: { main: '#F9B54C', dark: '#E09112' },
  focus: { main: '#FC6F58', dark: '#F1543F' },
  sleep: { main: '#7C9CFF', dark: '#5A7DE0' },
  book: { main: '#4ADE80', dark: '#22C55E' },
};

export function BadgeIcon({ size = 44, type }: Props) {
  const { main, dark } = COLORS[type];

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Dark outer ring */}
      <Circle cx="32" cy="32" r="30" fill="#324A5E" />

      {/* Main coloured body */}
      <Circle cx="32" cy="32" r="24" fill={main} />
      <Circle cx="32" cy="32" r="24" fill={dark} opacity={0.2} />

      {/* Bright inner circle for contrast */}
      <Circle cx="32" cy="32" r="15" fill="#FFFFFF" />

      {/* ===== SUN ===== */}
      {type === 'sun' && (
        <>
          <Circle cx="32" cy="32" r="6" fill={dark} />
          <Path
            d="M32 14v5M32 45v5M14 32h5M45 32h5M18 18l3.5 3.5M42.5 42.5L46 46M18 46l3.5-3.5M42.5 21.5L46 18"
            stroke={dark}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}

      {/* ===== FOCUS ===== */}
      {type === 'focus' && (
        <>
          <Circle cx="32" cy="32" r="9" stroke={dark} strokeWidth="3" fill="none" />
          <Circle cx="32" cy="32" r="3.5" fill={dark} />
        </>
      )}

      {/* ===== SLEEP ===== */}
      {type === 'sleep' && (
        <Path
          d="M36 17c-6 0-11 5-11 11s5 11 11 11c1.6 0 3.1-.3 4.5-.9-2.6 3.8-7 6.3-12 6.3-7.7 0-14-6.3-14-14s6.3-14 14-14c5 0 9.4 2.5 12 6.3-1.4-.6-2.9-.9-4.5-.9z"
          fill={dark}
        />
      )}

      {/* ===== BOOK ===== */}
      {type === 'book' && (
        <>
          <Path
            d="M19 19h11c1.8 0 3.5 1.4 3.5 3.5v19c0-2.2-1.7-3.5-3.5-3.5H19V19z"
            fill={dark}
            opacity={0.9}
          />
          <Path
            d="M45 19H34c-1.8 0-3.5 1.4-3.5 3.5v19c0-2.2 1.7-3.5 3.5-3.5h11V19z"
            fill={dark}
          />
          <Path d="M32 22.5v16" stroke="#FFFFFF" strokeWidth="2" />
        </>
      )}
    </Svg>
  );
}