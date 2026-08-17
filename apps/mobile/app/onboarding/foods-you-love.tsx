import { router } from 'expo-router';
import { FoodSelectionScreen } from '@/components/onboarding-food-selection';
export default function FoodsYouLoveScreen(){return <FoodSelectionScreen preferenceKey="loves" percent={41} title="What foods do you" accent="love?" subtitle="Choose all that sound good. We’ll use these to personalize recommendations." onContinue={()=>router.push('/onboarding/foods-to-avoid')}/>;}
