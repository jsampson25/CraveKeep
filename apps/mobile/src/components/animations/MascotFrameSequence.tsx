import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

export type MascotFrameSequenceProps = {
  frames: ImageSourcePropType[];
  frameDurationMs?: number;
  transitionDurationMs?: number;
  size?: number | { width: number; height: number };
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

export function MascotFrameSequence({
  frames,
  frameDurationMs = 360,
  transitionDurationMs = 120,
  size = 220,
  accessibilityLabel,
  style,
}: MascotFrameSequenceProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const indexRef = useRef(0);
  const dimensions = typeof size === 'number' ? { width: size, height: size } : size;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    indexRef.current = 0;
    setFrameIndex(0);
    opacity.setValue(1);
    if (reduceMotion || frames.length < 2) return;

    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % frames.length;
      Animated.timing(opacity, {
        toValue: 0,
        duration: transitionDurationMs,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        indexRef.current = next;
        setFrameIndex(next);
        Animated.timing(opacity, {
          toValue: 1,
          duration: transitionDurationMs,
          useNativeDriver: true,
        }).start();
      });
    }, frameDurationMs);

    return () => {
      clearInterval(timer);
      opacity.stopAnimation();
    };
  }, [frameDurationMs, frames.length, opacity, reduceMotion, transitionDurationMs]);

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[dimensions, styles.container, style]}>
      <Animated.View style={[dimensions, { opacity }]}>
        <Image source={frames[frameIndex]} resizeMode="contain" style={dimensions} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
