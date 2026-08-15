import { createSourcePreview } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button, Field, Screen, Title } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

export default function PasteLinkScreen() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string>();
  const preview = () => {
    try { const source = createSourcePreview(url); router.push({ pathname: '/capture/preview', params: { url: source.url } }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Enter a valid recipe link.'); }
  };
  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
    <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={24} /></Pressable>
    <View style={styles.content}><Text style={styles.kicker}>PASTE A LINK</Text><MotionSlot name="recipe-import" size={84} accessibilityLabel="Animated recipe capture state" /><Title>Bring that recipe home.</Title><Text style={styles.body}>Paste a recipe, post, or video link. CraveKeep confirms the source before processing anything.</Text><Field autoCapitalize="none" autoCorrect={false} keyboardType="url" label="Recipe, post, or video link" onChangeText={(value) => { setUrl(value); setError(undefined); }} placeholder="https://example.com/recipe" value={url} error={error} /><Button disabled={!url.trim()} label="Find the recipe" onPress={preview} /><Pressable onPress={() => setUrl('https://cravekeep.com/samples/lemon-herb-chicken')} style={styles.sample}><Text style={styles.sampleText}>Use the acceptance-test sample</Text></Pressable></View>
    <View style={styles.notice}><Ionicons color={colors.herb} name="shield-checkmark-outline" size={21} /><Text style={styles.noticeText}>Clipboard contents are never read silently.</Text></View>
  </KeyboardAvoidingView></Screen>;
}
const styles = StyleSheet.create({ screen: { flex: 1, padding: spacing.lg }, back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, content: { flex: 1, justifyContent: 'center', gap: spacing.lg }, kicker: { color: colors.coralDark, fontWeight: '900', letterSpacing: 1.2 }, body: { color: colors.muted, fontSize: 16, lineHeight: 23 }, sample: { alignItems: 'center', padding: spacing.sm }, sampleText: { color: colors.coralDark, fontWeight: '700' }, notice: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', padding: spacing.md, borderRadius: radii.medium, backgroundColor: colors.herbSoft }, noticeText: { flex: 1, color: colors.herb, fontWeight: '700' } });
