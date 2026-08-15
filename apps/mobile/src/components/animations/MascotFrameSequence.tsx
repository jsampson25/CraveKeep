import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, StyleSheet, Text, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

export type MascotFrameSequenceProps = {
  frames: ImageSourcePropType[];
  frameDurationMs?: number;
  transitionDurationMs?: number;
  size?: number | { width: number; height: number };
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

const poses = [
  { y: 18, rotate: -3, scale: 0.9 },
  { y: -8, rotate: -12, scale: 1.03 },
  { y: -14, rotate: 10, scale: 1.1 },
  { y: 8, rotate: 0, scale: 0.96 },
];

export function MascotFrameSequence({
  frames,
  frameDurationMs = 900,
  transitionDurationMs = 160,
  size = 220,
  accessibilityLabel,
  style,
}: MascotFrameSequenceProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const bodyY = useRef(new Animated.Value(poses[0].y)).current;
  const bodyRotate = useRef(new Animated.Value(poses[0].rotate)).current;
  const bodyScale = useRef(new Animated.Value(poses[0].scale)).current;
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
    const pose = poses[frameIndex] ?? poses[0];
    Animated.parallel([
      Animated.timing(bodyY, { toValue: pose.y, duration: transitionDurationMs * 2, useNativeDriver: true }),
      Animated.timing(bodyRotate, { toValue: pose.rotate, duration: transitionDurationMs * 2, useNativeDriver: true }),
      Animated.timing(bodyScale, { toValue: pose.scale, duration: transitionDurationMs * 2, useNativeDriver: true }),
    ]).start();
  }, [bodyRotate, bodyScale, bodyY, frameIndex, transitionDurationMs]);

  useEffect(() => {
    indexRef.current = 0;
    setFrameIndex(0);
    opacity.setValue(1);
    bodyY.setValue(poses[0].y);
    bodyRotate.setValue(poses[0].rotate);
    bodyScale.setValue(poses[0].scale);
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
  }, [bodyRotate, bodyScale, bodyY, frameDurationMs, frames.length, opacity, reduceMotion, transitionDurationMs]);

  const showWaveAccent = !reduceMotion && (frameIndex === 1 || frameIndex === 2);

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[dimensions, styles.container, style]}>
      {showWaveAccent ? <Text pointerEvents="none" style={styles.waveAccent}>〰</Text> : null}
      <Animated.View style={[dimensions, {
        opacity,
        transform: [
          { translateY: bodyY },
          { rotate: bodyRotate.interpolate({ inputRange: [-8, 7], outputRange: ['-8deg', '7deg'] }) },
          { scale: bodyScale },
        ],
      }]}>
        <Image key={frameIndex} source={frames[frameIndex]} resizeMode="contain" style={dimensions} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  waveAccent: { position: 'absolute', right: 18, top: 28, zIndex: 2, color: '#FF665F', fontSize: 36, fontWeight: '900' },
});
