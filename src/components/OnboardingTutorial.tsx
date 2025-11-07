"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, Coins, Target, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to EchoID Carnival! 🎪",
    description: "Your decentralized identity platform with a carnival twist. Complete quests, earn XP, and build your reputation on the blockchain!",
    icon: <Sparkles className="w-8 h-8" />,
    color: "from-carnival-marquee to-carnival-candy"
  },
  {
    title: "Connect Your Wallet",
    description: "Start by connecting your Polkadot wallet. This creates your unique identity on the EchoID platform.",
    icon: <Target className="w-8 h-8" />,
    color: "from-carnival-mint to-green-500"
  },
  {
    title: "Complete Quests & Earn XP",
    description: "Take on daily quests, create your profile, and issue attestations to earn XP and level up your carnival character!",
    icon: <Trophy className="w-8 h-8" />,
    color: "from-carnival-violet to-purple-600"
  },
  {
    title: "Collect Coins & Unlock Rewards",
    description: "Earn carnival coins with every action. Use them to unlock exclusive badges, customize your profile, and more!",
    icon: <Coins className="w-8 h-8" />,
    color: "from-carnival-ticket to-carnival-twist"
  }
];

export default function OnboardingTutorial() {
  const { hasSeenTutorial, setHasSeenTutorial } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't seen tutorial
    if (!hasSeenTutorial && typeof window !== 'undefined') {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setHasSeenTutorial(true);
  };

  const handleSkip = () => {
    handleClose();
  };

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={handleSkip}
          />

          {/* Tutorial Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="glass-strong rounded-2xl p-8 border-2 border-white/20 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 animate-gradient`}
                   style={{ backgroundSize: '200% 200%' }} />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-glow-violet`}
              >
                {step.icon}
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-3">
                  {step.title}
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-8">
                  {step.description}
                </p>
              </motion.div>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-gradient-to-r from-carnival-mint to-carnival-ticket'
                        : 'w-2 bg-white/20 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 text-white/60 hover:text-white/90 font-medium transition-colors"
                >
                  Skip Tutorial
                </button>

                <button
                  onClick={handleNext}
                  className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 bg-gradient-to-r ${step.color} hover:scale-105 transition-spring`}
                >
                  {isLastStep ? (
                    <>
                      Let's Go!
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Floating particles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-carnival-mint rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-carnival-violet rounded-full blur-3xl pointer-events-none"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
