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
  const { user } = useAuthStore();
  const { profile, update, usernameAvailable, saveProfile, saving, error } = useOnboardingStore();
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    if (!user || (profile.displayName && profile.handle)) return;
    let active = true;
    const prepareDefaults = async () => {
      const metadata = user.user_metadata;
      const firstName = String(metadata.first_name || metadata.given_name || '').trim();
      const lastName = String(metadata.last_name || metadata.family_name || '').trim();
      const accountName = String(metadata.full_name || metadata.name || metadata.display_name || '').trim();
      const emailName = user.email?.split('@')[0]?.replace(/[._-]+/g, ' ').trim() || '';
      const displayName = profile.displayName || [firstName, lastName].filter(Boolean).join(' ') || accountName || emailName;
      const parts = displayName.split(/\s+/).filter(Boolean);
      const first = parts[0] || 'crave';
      const last = parts.length > 1 ? parts[parts.length - 1] : 'cook';
      const base = (first + last).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'cravecook';
      let handle = profile.handle;
      if (!handle) {
        for (let attempt = 0; attempt < 8; attempt += 1) {
          const candidate = base + String(Math.floor(10 + Math.random() * 990));
          handle = candidate.slice(0, 24);
          try { if (await usernameAvailable(handle)) break; } catch { break; }
        }
      }
      if (active) await update({ displayName, handle });
    };
    void prepareDefaults();
    return () => { active = false; };
  }, [profile.displayName, profile.handle, update, user, usernameAvailable]);
  const next = async () => {
    const handle = profile.handle.trim().toLowerCase().replace(/^@/, '');
    if (!profile.displayName.trim()) return setMessage('Enter the name people should see.');
    if (!/^[a-z0-9_]{3,24}$/.test(handle)) return setMessage('Username must be 3–24 letters, numbers, or underscores.');
    setMessage('Checking username…');
    try {
      if (!await usernameAvailable(handle)) return setMessage('That username is already taken. Try another one.');
      setMessage(undefined); await update({ handle });
      if (!await saveProfile()) router.push('/onboarding/main-goal');
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'We could not save your profile. Please try again.');
    }
  };
  return <OnboardingShell title="Create your profile" percent={10} footer={<Button disabled={saving} label={saving ? 'Saving…' : 'Build my food profile'} onPress={() => void next()} />}><View style={styles.intro}><View style={styles.avatar}><Ionicons color={colors.white} name="person" size={30} /></View><View style={styles.flex}><Text style={styles.heading}>Set up your profile</Text><Text style={styles.body}>Choose the name and username people will see when you share recipes or connect with them.</Text></View></View><Field autoComplete="name" label="Display name" onChangeText={displayName => void update({ displayName })} placeholder="Jason Sampson" value={profile.displayName} /><Field autoCapitalize="none" autoCorrect={false} label="Username" onChangeText={handle => { setMessage(undefined); void update({ handle: handle.replace(/^@/, '').toLowerCase() }); }} placeholder="jasonsampson57" value={profile.handle} /><Text style={styles.suggestion}>Suggested from your name. You can change it.</Text><Text style={styles.preview}>cravekeep.com/@{profile.handle || 'yourname'}</Text><Text style={styles.private}>Only your display name, username, and profile photo are visible to people you share with. Your food and health information stays private.</Text>{message || error ? <Text style={styles.error}>{message || error}</Text> : null}</OnboardingShell>;
}
const styles=StyleSheet.create({intro:{flexDirection:'row',alignItems:'center',gap:spacing.md},avatar:{width:64,height:64,borderRadius:32,backgroundColor:colors.charcoal,alignItems:'center',justifyContent:'center'},flex:{flex:1},heading:{...typography.title,fontSize:22,color:colors.charcoal},body:{color:colors.muted,lineHeight:19},suggestion:{marginTop:-spacing.sm,color:colors.muted,fontSize:11},preview:{color:colors.herb,textAlign:'center'},private:{color:colors.muted,fontSize:12,lineHeight:18,textAlign:'center'},error:{color:colors.coralDark,textAlign:'center'}});
