import type { ComponentProps } from 'react';
import { LottieMotion } from './LottieMotion';
import launchReveal from '../../../assets/animations/launch-reveal.json';
import onboardingRecipeCard from '../../../assets/animations/onboarding-recipe-card.json';

const sources = {
  'launch-reveal': launchReveal,
  'onboarding-recipe-card': onboardingRecipeCard,
} as const;

export type MotionSlotName = keyof typeof sources;
export type MotionSlotProps = Omit<ComponentProps<typeof LottieMotion>, 'source'> & { name: MotionSlotName };

export function MotionSlot({ name, ...props }: MotionSlotProps) {
  return <LottieMotion source={sources[name]} {...props} />;
}