import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Eyebrow, Screen, Title } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

const paths = [
  { icon: 'share-outline', title: 'From another app', detail: 'Instagram, TikTok, YouTube, and more', ready: false },
  { icon: 'link-outline', title: 'Paste a link', detail: 'From a website or any recipe page', ready: true, route: '/capture/link' },
  { icon: 'camera-outline', title: 'Scan a recipe', detail: 'Use the camera for cards and cookbooks', ready: false },
  { icon: 'images-outline', title: 'Choose photos or a file', detail: 'Screenshots, images, and PDFs', ready: false },
  { icon: 'create-outline', title: 'Create it myself', detail: 'Write your own recipe from scratch', ready: true, route: '/recipes/new' }
] as const;

export default function CaptureScreen() {
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Pressable accessibilityLabel="Close Capture Studio" onPress={() => router.back()} style={styles.close}><Ionicons color={colors.charcoal} name="close" size={26} /></Pressable>
    <Eyebrow>Capture Studio</Eyebrow><Title>Where is this recipe?</Title><Text style={styles.intro}>Choose the source you have. Your source and unfinished work will stay attached.</Text>
    <View style={styles.paths}>{paths.map((path) => <Pressable accessibilityRole="button" key={path.title} onPress={() => path.ready && 'route' in path && router.push(path.route)} style={({ pressed }) => [styles.path, pressed && path.ready && styles.pressed]}><View style={styles.icon}><Ionicons color={path.ready ? colors.coral : colors.muted} name={path.icon} size={27} /></View><View style={styles.copy}><Text style={styles.pathTitle}>{path.title}</Text><Text style={styles.detail}>{path.detail}</Text></View>{path.ready ? <Ionicons color={colors.coral} name="chevron-forward" size={22} /> : <Text style={styles.soon}>Coming soon</Text>}</Pressable>)}</View>
    <Button label="View import history" variant="secondary" onPress={() => router.push('/imports')} />
    <Text style={styles.privacy}><Ionicons name="lock-closed-outline" size={13} /> New recipes stay private unless you explicitly share them.</Text>
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 50 }, close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }, intro: { color: colors.muted, fontSize: 16, lineHeight: 23 }, paths: { borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, overflow: 'hidden', backgroundColor: colors.paperRaised }, path: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line }, pressed: { backgroundColor: colors.herbSoft }, icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper }, copy: { flex: 1, gap: 3 }, pathTitle: { color: colors.charcoal, fontSize: 16, fontWeight: '800' }, detail: { color: colors.muted, fontSize: 13 }, soon: { color: colors.muted, fontSize: 11, fontWeight: '700' }, privacy: { color: colors.muted, textAlign: 'center', fontSize: 12 } });
