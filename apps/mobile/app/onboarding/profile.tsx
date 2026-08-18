import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button, Field } from '@/components/ui';
import { useAuthStore } from '@/data/auth-store';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, spacing, typography } from '@/theme';
import mascot from '../../assets/mascots/recipe-keeper.png';

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
  return <OnboardingShell title={<>Create your <Text style={styles.accent}>profile</Text></>} percent={8} footer={<Button disabled={saving} label={saving ? 'Saving…' : 'Continue'} onPress={() => void next()} />}><View style={styles.avatarWrap}><View style={styles.avatar}><Ionicons color={colors.muted} name="person" size={48} /></View><View style={styles.camera}><Ionicons color={colors.charcoal} name="camera-outline" size={18} /></View></View><Field autoComplete="name" label="Display name" onChangeText={displayName => void update({ displayName })} placeholder="Jason Sampson" value={profile.displayName} /><Field autoCapitalize="none" autoCorrect={false} label="Username" onChangeText={handle => { setMessage(undefined); void update({ handle: handle.replace(/^@/, '').toLowerCase() }); }} placeholder="jasonsampson57" value={profile.handle} />{message || error ? <Text style={styles.error}>{message || error}</Text> : <Text style={styles.available}><Ionicons name="checkmark-circle" size={14} /> Suggested username</Text>}<View style={styles.note}><Ionicons color={colors.herb} name="leaf-outline" size={20} /><Text style={styles.noteText}>You can change these later in Account Settings.</Text></View><Text style={styles.private}>Your food preferences and health information stay private.</Text><Image accessibilityLabel="CraveKeep profile helper" resizeMode="contain" source={mascot} style={styles.mascot} /></OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},avatarWrap:{width:126,height:126,alignSelf:'center',marginBottom:8},avatar:{width:116,height:116,borderRadius:58,borderWidth:1.5,borderColor:'#D8D0C9',backgroundColor:'#F7F4F1',alignItems:'center',justifyContent:'center'},camera:{position:'absolute',right:0,bottom:8,width:38,height:38,borderRadius:19,borderWidth:1,borderColor:'#D8D0C9',backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'},available:{marginTop:-spacing.sm,color:colors.herb,fontSize:12},note:{flexDirection:'row',alignItems:'center',gap:10,padding:13,borderRadius:12,backgroundColor:'#FAF4EC',borderWidth:1,borderColor:'#EAD8C5'},noteText:{flex:1,color:colors.charcoal,fontSize:12,lineHeight:17},private:{color:colors.muted,fontSize:12,lineHeight:18,textAlign:'center'},error:{color:colors.coralDark,textAlign:'center'},mascot:{position:'absolute',width:150,height:150,right:-24,bottom:-24}});
