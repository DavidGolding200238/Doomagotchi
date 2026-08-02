import { SymbolView, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

// We use a wider type so we can use custom names
type AppIconName =
  | 'house.fill'
  | 'chart.bar.fill'
  | 'skull'
  | 'paperplane.fill'
  | 'chevron.right'
  | 'chevron.left.forwardslash.chevron.right';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: AppIconName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Map our custom names to real SF Symbols that exist
  const sfName =
    name === 'skull'
      ? 'flame.fill' // closest thematic icon that is always available
      : name;

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={sfName as any}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}