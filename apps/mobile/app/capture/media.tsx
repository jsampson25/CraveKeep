import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button, Card, Screen, Title } from '@/components/ui';
import { useAuthStore } from '@/data/auth-store';
import { uploadCaptureImage } from '@/data/capture-assets';
import { useImportStore } from '@/data/import-store';
import { colors, radii, spacing } from '@/theme';

export default function MediaCaptureScreen() {
  const { mode = 'library' } = useLocalSearchParams<{ mode?: 'camera' | 'library' }>();
  const { user } = useAuthStore();
  const { createJob, updateJob } = useImportStore();
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  const choose = async () => {
    if (busy) return;
    setBusy(true);
    setMessage(undefined);
    if (mode === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) { setMessage('Camera permission is required to scan a recipe. You can choose a saved photo instead.'); return; }
    }
    let result: ImagePicker.ImagePickerResult;
    try {
      result = mode === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.9 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9, selectionLimit: 1 });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not open your camera or photo library.');
      setBusy(false);
      return;
    }
    if (!result.canceled) setAsset(result.assets[0]);
    setBusy(false);
  };

  const continueToReview = async () => {
    if (!asset) return;
    setBusy(true);
    setMessage(undefined);
    const title = asset.fileName || (mode === 'camera' ? 'Scanned recipe' : 'Recipe photo');
    const job = await createJob({ host: mode === 'camera' ? 'Camera scan' : 'Photo import', title, mediaType: 'image', localUri: asset.uri });
    if (user) {
      try {
        const storagePath = await uploadCaptureImage(asset, user.id, job.id);
        await updateJob(job.id, { source: { ...job.source, storagePath } });
      } catch {
        await updateJob(job.id, { warnings: ['Cloud upload could not finish. The image remains available on this device.'] });
      }
    }
    router.replace({ pathname: '/capture/processing', params: { jobId: job.id } });
  };

  return <Screen style={styles.screen}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={24} /></Pressable><View style={styles.content}>
    <Text style={styles.kicker}>{mode === 'camera' ? 'SCAN A RECIPE' : 'CHOOSE A PHOTO'}</Text><MotionSlot name="recipe-import" size={84} accessibilityLabel="Animated recipe capture state" /><Title>{asset ? 'Is this image readable?' : mode === 'camera' ? 'Frame the whole recipe.' : 'Choose your clearest image.'}</Title>
    {asset ? <Card style={styles.previewCard}><Image accessibilityLabel="Selected recipe image" resizeMode="contain" source={{ uri: asset.uri }} style={styles.preview} /><Text numberOfLines={1} style={styles.fileName}>{asset.fileName || 'Recipe image'}</Text></Card> : <Card style={styles.empty}><Ionicons color={colors.coral} name={mode === 'camera' ? 'camera-outline' : 'images-outline'} size={62} /><Text style={styles.body}>Include the title, ingredients, and directions. You can correct every field before saving.</Text></Card>}
    {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
    {busy ? <ActivityIndicator color={colors.coral} /> : asset ? <><Button label="Use this image" onPress={() => void continueToReview()} /><Button label="Choose another" variant="secondary" onPress={() => void choose()} /></> : <Button label={mode === 'camera' ? 'Open camera' : 'Choose photo'} onPress={() => void choose()} />}
    <View style={styles.privacy}><Ionicons color={colors.herb} name="lock-closed-outline" size={20} /><Text style={styles.privacyText}>{user ? 'Signed-in images upload to your private, owner-only storage folder.' : 'This image stays on this device until you sign in.'}</Text></View>
  </View></Screen>;
}

const styles = StyleSheet.create({ screen: { padding: spacing.lg, gap: spacing.md }, back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, content: { flex: 1, justifyContent: 'center', gap: spacing.md }, kicker: { color: colors.coralDark, fontWeight: '900', letterSpacing: 1.2 }, previewCard: { gap: spacing.sm }, preview: { width: '100%', height: 280, borderRadius: radii.small, backgroundColor: colors.paper }, fileName: { color: colors.charcoal, fontWeight: '800' }, empty: { minHeight: 250, alignItems: 'center', justifyContent: 'center', gap: spacing.md }, body: { color: colors.muted, textAlign: 'center', lineHeight: 21 }, message: { color: colors.coralDark, backgroundColor: '#FFF0ED', padding: spacing.md, borderRadius: radii.small }, privacy: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.herbSoft, borderRadius: radii.medium }, privacyText: { flex: 1, color: colors.herb, fontWeight: '700', lineHeight: 20 } });
