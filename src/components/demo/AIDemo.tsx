"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, Star, Zap, ArrowRight } from "lucide-react";

const demoSteps = [
  {
    id: 1,
    title: "AI Analyzes Your Taste",
    description: "Machine learning processes your viewing history",
    icon: Brain,
    color: "from-blue-500 to-purple-600",
    visual: "🧠→📊→🎯",
  },
  {
    id: 2,
    title: "Smart Recommendations",
    description: "Get personalized suggestions with 95% accuracy",
    icon: Zap,
    color: "from-purple-500 to-pink-600",
    visual: "🎬✨🎯",
  },
  {
    id: 3,
    title: "Perfect Match Found",
    description: "Discover your next favorite movie instantly",
    icon: Star,
    color: "from-pink-500 to-red-600",
    visual: "💝🎬🌟",
  },
];

export function AIDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const playDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);

    // Auto-advance through steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= demoSteps.length) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 2000);
  };

  const currentStepData = demoSteps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
      {/* Demo Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          See AI in Action
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Watch how our AI learns your preferences in real-time
        </p>
      </div>

      {/* Visual Demo */}
      <div className="relative mb-8">
        <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative">
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="absolute inset-0 opacity-20">
              {/* Animated Grid */}
              <div className="grid grid-cols-8 grid-rows-6 gap-1 h-full p-4">
                {Array.from({ length: 48 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isPlaying && Math.random() > 0.7 ? [0, 1, 0] : 0,
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 rounded"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center text-white"
              >
                {/* Step Icon */}
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-r ${currentStepData.color} flex items-center justify-center shadow-2xl`}
                >
                  <StepIcon className="w-10 h-10" />
                </div>

                {/* Visual Representation */}
                <div className="text-4xl mb-4 font-mono tracking-wider">
                  {currentStepData.visual}
                </div>

                {/* Step Info */}
                <h4 className="text-xl font-bold mb-2">
                  {currentStepData.title}
                </h4>
                <p className="text-slate-300 max-w-sm mx-auto">
                  {currentStepData.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Play Button */}
          {!isPlaying && (
            <button
              onClick={playDemo}
              className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <Play className="w-6 h-6 fill-current" />
            </button>
          )}

          {/* Loading indicator */}
          {isPlaying && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className={`h-2 bg-gradient-to-r ${currentStepData.color} rounded-full`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-3 mb-6">
        {demoSteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(index)}
            className={`w-12 h-12 rounded-xl transition-all duration-300 ${
              index === currentStep
                ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            <step.icon className="w-5 h-5 mx-auto" />
          </button>
        ))}
      </div>

      {/* Manual Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentStep(
              (prev) => (prev - 1 + demoSteps.length) % demoSteps.length
            )
          }
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Previous
        </button>

        <div className="text-center">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Step {currentStep + 1} of {demoSteps.length}
          </span>
        </div>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Stats */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              95%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Accuracy
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              1.2s
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Response Time
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              ∞
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Learning
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
