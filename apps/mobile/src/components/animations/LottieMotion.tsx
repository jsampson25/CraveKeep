import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export type LottieMotionProps = {
  source: object;
  size?: number | { width: number; height: number };
  loop?: boolean;
  autoPlay?: boolean;
  speed?: number;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  onComplete?: () => void;
};

export function LottieMotion({
  source, size = 180, loop = true, autoPlay = true, speed = 1, accessibilityLabel, style, onComplete,
}: LottieMotionProps) {
  const animation = useRef<LottieView>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    return () => { mounted = false; };
  }, []);

  const dimensions = typeof size === 'number' ? { width: size, height: size } : size;

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[dimensions, styles.container, style]}>
      <LottieView
        ref={animation} source={source} autoPlay={autoPlay && !reduceMotion}
        loop={loop && !reduceMotion} speed={speed} style={dimensions}
        resizeMode='contain' onAnimationFinish={onComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});