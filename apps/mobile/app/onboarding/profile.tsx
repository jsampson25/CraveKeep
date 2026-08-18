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
  return <OnboardingShell title={<>Create your <Text style={styles.accent}>profile</Text></>} percent={12} footer={<Button disabled={saving} label={saving ? 'Saving…' : 'Continue'} onPress={() => void next()} />}><View style={styles.hero}><View><View style={styles.avatar}><Ionicons color={colors.muted} name="person-outline" size={42} /></View><View style={styles.camera}><Ionicons color={colors.white} name="add" size={18} /></View><Text style={styles.addPhoto}>Add photo</Text></View><Image accessibilityLabel="CraveKeep mascot holding a profile card" resizeMode="contain" source={mascot} style={styles.mascot} /></View><Field autoComplete="name" label="Display name" onChangeText={displayName => void update({ displayName })} placeholder="Jason Sampson" value={profile.displayName} /><Field autoCapitalize="none" autoCorrect={false} label="Username" onChangeText={handle => { setMessage(undefined); void update({ handle: handle.replace(/^@/, '').toLowerCase() }); }} placeholder="jasonsampson57" value={profile.handle} />{message || error ? <Text style={styles.error}>{message || error}</Text> : <Text style={styles.available}>Username is available</Text>}<View style={styles.privacyRow}><View><Text style={styles.privacyTitle}>Keep my profile private</Text><Text style={styles.privacyCopy}>Your username is used when you share recipes or join the community.</Text></View><View style={styles.toggle}><View style={styles.toggleKnob} /></View></View><View style={styles.note}><Ionicons color={colors.herb} name="leaf-outline" size={20} /><Text style={styles.noteText}>You can change these later in Account Settings.</Text></View></OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},hero:{height:158,flexDirection:'row',alignItems:'center',justifyContent:'space-around'},avatar:{width:92,height:92,borderRadius:46,borderWidth:1.5,borderStyle:'dashed',borderColor:'#AFA8A1',backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'},camera:{position:'absolute',right:-4,bottom:20,width:30,height:30,borderRadius:15,backgroundColor:colors.charcoal,alignItems:'center',justifyContent:'center'},addPhoto:{marginTop:7,color:colors.charcoal,fontSize:11,textAlign:'center'},mascot:{width:148,height:148},available:{marginTop:-spacing.sm,color:colors.herb,fontSize:12,fontWeight:'700'},privacyRow:{minHeight:72,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},privacyTitle:{color:colors.charcoal,fontSize:13,fontWeight:'700'},privacyCopy:{maxWidth:245,marginTop:5,color:colors.muted,fontSize:11,lineHeight:16},toggle:{width:48,height:28,borderRadius:14,backgroundColor:'#E5E0DB',padding:3},toggleKnob:{width:22,height:22,borderRadius:11,backgroundColor:'#FFFFFF'},note:{flexDirection:'row',alignItems:'center',gap:10,padding:13,borderRadius:12,backgroundColor:'#FAF4EC',borderWidth:1,borderColor:'#EAD8C5'},noteText:{flex:1,color:colors.charcoal,fontSize:12,lineHeight:17},error:{color:colors.coralDark,textAlign:'center'}});
