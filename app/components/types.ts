/**
 * TypeScript type definitions for Ad Draft Challenge
 */

export type ViewMode = "gallery" | "table";

export interface AdCopy {
  headline: string;
  description: string;
  callToAction: string;
  launchAs: "active" | "paused";
}

export interface StoreState {
  adCopy: AdCopy;
  updateField: (field: keyof AdCopy, value: string) => void;
  updateAll: (data: AdCopy) => void;
}
export interface TableRow extends AdCopy {
  id: string;
  isCustomized: boolean;
}
