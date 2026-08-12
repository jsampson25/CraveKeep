import { Animated, Image, StyleSheet, View } from 'react-native';
import logoC from '../../assets/brand/welcome-logo-piece-c.png';
import logoRight from '../../assets/brand/welcome-logo-piece-right.png';
import logoWord from '../../assets/brand/welcome-logo-piece-word.png';

export function AnimatedBrandLogo({ assemble, word }: { assemble: Animated.Value; word: Animated.Value }) {
  return <View accessibilityLabel="CraveKeep" style={styles.lockup}><View style={styles.mark}><Animated.Image resizeMode="contain" source={logoC} style={[styles.markPiece, { opacity: assemble, transform: [{ translateX: assemble.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] }) }] }]} /><Animated.Image resizeMode="contain" source={logoRight} style={[styles.markPiece, { opacity: assemble, transform: [{ translateX: assemble.interpolate({ inputRange: [0, 1], outputRange: [120, 0] }) }] }]} /></View><Animated.View style={[styles.wordWrap, { opacity: word, transform: [{ translateY: word.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}><Image resizeMode="contain" source={logoWord} style={styles.word} /></Animated.View></View>;
}

const styles = StyleSheet.create({ lockup: { width: 300, height: 286, alignItems: 'center' }, mark: { width: 280, height: 210 }, markPiece: { position: 'absolute', width: 280, height: 210 }, wordWrap: { width: 260, height: 68, marginTop: -2 }, word: { width: '100%', height: '100%' } });
