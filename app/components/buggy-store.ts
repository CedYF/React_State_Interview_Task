/**
 * Zustand Store - DO NOT MODIFY THIS FILE
 *
 * This store holds form data with multiple fields.
 * The bugs are in BuggyApp.tsx, not here!
 */

import { create } from 'zustand';
import type { FormData } from './types';

interface StoreState {
  data: FormData;
  updateField: (field: keyof FormData, value: string) => void;
  updateAll: (data: FormData) => void;
}

export const useStore = create<StoreState>((set) => ({
  data: {
    headline: '',
    callToAction: '',
    description: '',
    link: '',
  },

  updateField: (field: keyof FormData, value: string) => {
    console.log(`[Store] 💾 Updating ${field} to:`, value);
    set((state) => ({
      data: { ...state.data, [field]: value }
    }));
  },

  updateAll: (data: FormData) => {
    console.log('[Store] 💾 Updating all data:', data);
    set({ data });
  },
}));
