/**
 * TypeScript type definitions for State Sync Challenge
 */

export type ViewMode = 'gallery' | 'table';

export interface FormData {
  headline: string;
  callToAction: string;
  description: string;
  link: string;
}

export interface StoreState {
  data: FormData;
  updateField: (field: keyof FormData, value: string) => void;
  updateAll: (data: FormData) => void;
}
