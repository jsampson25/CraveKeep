import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button, Field } from '@/components/ui';
import { useAuthStore } from '@/data/auth-store';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, spacing, typography } from '@/theme';

export default function OnboardingProfileScreen() {
  const { user } = useAuthStore(); const { profile, update, saveProfile, saving, error } = useOnboardingStore(); const [message, setMessage] = useState<string>();
  useEffect(() => { if (!profile.displayName && user) void update({ displayName: user.user_metadata.display_name || user.email?.split('@')[0] || '' }); }, [profile.displayName, update, user]);
  const next = async () => { const handle = profile.handle.trim().toLowerCase().replace(/^@/, ''); if (!profile.displayName.trim()) return setMessage('Enter the name people should see.'); if (!/^[a-z0-9_]{3,24}$/.test(handle)) return setMessage('Username must be 3–24 letters, numbers, or underscores.'); await update({ handle }); const result = await saveProfile(); if (!result) router.push('/onboarding/food-profile'); };
  return <OnboardingShell title="Create your profile" percent={45} footer={<Button disabled={saving} label={saving ? 'Saving…' : 'Build my food profile'} onPress={() => void next()} />}><View style={styles.intro}><View style={styles.avatar}><Ionicons color={colors.white} name="person" size={30} /></View><View style={styles.flex}><Text style={styles.heading}>How should cooks know you?</Text><Text style={styles.body}>Your username is public. Your food and health information stays private.</Text></View></View><Field autoComplete="name" label="Display name" onChangeText={(displayName) => void update({ displayName })} placeholder="Jason Sampson" value={profile.displayName} /><Field autoCapitalize="none" autoCorrect={false} label="Username" onChangeText={(handle) => void update({ handle: handle.replace(/^@/, '').toLowerCase() })} placeholder="jasonskitchen" value={profile.handle} /><Text style={styles.preview}>cravekeep.com/@{profile.handle || 'yourname'}</Text>{message || error ? <Text style={styles.error}>{message || error}</Text> : null}</OnboardingShell>;
}
const styles=StyleSheet.create({intro:{flexDirection:'row',alignItems:'center',gap:spacing.md},avatar:{width:64,height:64,borderRadius:32,backgroundColor:colors.charcoal,alignItems:'center',justifyContent:'center'},flex:{flex:1},heading:{...typography.title,fontSize:22,color:colors.charcoal},body:{color:colors.muted,lineHeight:19},preview:{color:colors.herb,textAlign:'center'},error:{color:colors.coralDark,textAlign:'center'}});
