import { createSourcePreview } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Screen, Title } from '@/components/ui';
import { useImportStore } from '@/data/import-store';
import { colors, spacing } from '@/theme';

export default function SourcePreviewScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const [busy, setBusy] = useState(false);
  const [parseError, setParseError] = useState<string>();
  const source = useMemo(() => { try { return createSourcePreview(url); } catch (error) { setParseError(error instanceof Error ? error.message : 'This source link is not valid.'); return undefined; } }, [url]);
  const { createJob } = useImportStore();
  const start = async () => { if (!source || busy) return; setBusy(true); try { const job = await createJob(source); router.replace({ pathname: '/capture/processing', params: { jobId: job.id } }); } catch (error) { setParseError(error instanceof Error ? error.message : 'We could not start this import.'); setBusy(false); } };
  if (!source) return <Screen style={styles.center}><Ionicons color={colors.coralDark} name="alert-circle-outline" size={52} /><Title>Source unavailable.</Title><Text style={styles.error}>{parseError ?? 'This link could not be read.'}</Text><Button label="Back to Capture" onPress={() => router.replace('/capture')} /></Screen>;
  return <Screen style={styles.screen}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={24} /></Pressable><View style={styles.content}><Text style={styles.kicker}>SOURCE PREVIEW</Text><Title>Is this the right source?</Title><Card style={styles.card}><View style={styles.sourceIcon}><Ionicons color={colors.coral} name={source.mediaType === 'video' ? 'play' : source.mediaType === 'social' ? 'people' : 'globe-outline'} size={34} /></View><Text style={styles.title}>{source.title}</Text><Text style={styles.host}>{source.host}</Text><Text numberOfLines={2} style={styles.url}>{source.url}</Text><View style={styles.lock}><Ionicons color={colors.herb} name="lock-closed" size={16} /><Text style={styles.lockText}>The source and attribution stay linked to your private recipe.</Text></View></Card></View><Button disabled={busy} label={busy ? 'Starting import…' : 'Import this recipe'} onPress={start} /></Screen>;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg }, error: { color: colors.coralDark, textAlign: 'center' }, screen: { padding: spacing.lg, gap: spacing.md }, back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, content: { flex: 1, justifyContent: 'center', gap: spacing.lg }, kicker: { color: colors.coralDark, fontWeight: '900', letterSpacing: 1.2 }, card: { gap: spacing.sm }, sourceIcon: { width: 70, height: 70, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0ED' }, title: { color: colors.charcoal, fontFamily: 'Georgia', fontSize: 26, fontWeight: '700' }, host: { color: colors.charcoal, fontWeight: '800' }, url: { color: colors.muted }, lock: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }, lockText: { flex: 1, color: colors.herb, fontWeight: '700' } });
