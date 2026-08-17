import { router } from 'expo-router';
import { FoodSelectionScreen } from '@/components/onboarding-food-selection';
export default function FoodsToAvoidScreen(){return <FoodSelectionScreen preferenceKey="avoids" percent={53} title="Anything you" accent="don’t like?" subtitle="We’ll keep these out of your recommendations." onContinue={()=>router.push('/onboarding/allergies')}/>;}
