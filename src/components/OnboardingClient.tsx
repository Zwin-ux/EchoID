"use client"

import dynamic from 'next/dynamic';

// Client-side only import with dynamic loading
const OnboardingTutorial = dynamic(
  () => import('./OnboardingTutorial'),
  { ssr: false }
);

export default function OnboardingClient() {
  return <OnboardingTutorial />;
}
