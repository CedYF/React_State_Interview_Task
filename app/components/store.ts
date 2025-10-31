/**
 * Zustand Store - DO NOT MODIFY THIS FILE
 *
 * This store holds the ad copy data that is shared between views.
 */

import { create } from 'zustand';
import type { AdCopy } from './types';

interface StoreState {
  adCopy: AdCopy;
  updateField: (field: keyof AdCopy, value: string) => void;
  updateAll: (data: AdCopy) => void;
}

export const useAdStore = create<StoreState>((set) => ({
  adCopy: {
    headline: 'Try Listening to Books Today!',
    description: 'Tired of reading long texts? 📚👀\nSpeechify reads to you, so you can multitask while learning or relaxing. Available on all devices.',
    callToAction: 'Learn More',
    launchAs: 'active',
  },

  updateField: (field: keyof AdCopy, value: string) => {
    console.log(`[Store] 💾 Updating ${field} to:`, value);
    set((state) => ({
      adCopy: { ...state.adCopy, [field]: value }
    }));
  },

  updateAll: (data: AdCopy) => {
    console.log('[Store] 💾 Updating all data:', data);
    set({ adCopy: data });
  },
}));
