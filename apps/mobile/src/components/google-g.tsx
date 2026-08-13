import { StyleSheet, View } from 'react-native';

const GOOGLE_BUTTON_BACKGROUND = '#FFFFFF';

// Four-color Google G, clipped into a compact brand mark without relying on an
// icon font (which only provides a monochrome glyph).
export function GoogleG() {
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.mark}>
    <View style={[styles.arc, styles.blue]} /><View style={[styles.arc, styles.red]} /><View style={[styles.arc, styles.yellow]} /><View style={[styles.arc, styles.green]} />
    <View style={styles.cutout} /><View style={styles.opening} /><View style={styles.crossbar} />
  </View>;
}

const styles = StyleSheet.create({
  mark: { width: 20, height: 20, overflow: 'hidden' },
  arc: { position: 'absolute', width: 20, height: 20, borderRadius: 10, borderWidth: 4 },
  blue: { borderColor: '#4285F4' }, red: { borderColor: '#EA4335', transform: [{ rotate: '-90deg' }], borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  yellow: { borderColor: '#FBBC05', transform: [{ rotate: '45deg' }], borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  green: { borderColor: '#34A853', transform: [{ rotate: '100deg' }], borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' },
  cutout: { position: 'absolute', left: 5, top: 5, width: 10, height: 10, borderRadius: 5, backgroundColor: GOOGLE_BUTTON_BACKGROUND },
  opening: { position: 'absolute', right: -1, top: 4, width: 8, height: 7, backgroundColor: GOOGLE_BUTTON_BACKGROUND },
  crossbar: { position: 'absolute', right: 0, top: 9, width: 9, height: 4, backgroundColor: '#4285F4' }
});
