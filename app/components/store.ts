/**
 * Zustand Store
 *
 * This store holds the ad copy data that is shared between views.
 *
 * NOTE: You can modify this store structure and implementation to fix the state synchronization bug.
 * Feel free to add new state properties, methods, or change the existing structure as needed.
 */

import { create } from "zustand";
import type { AdCopy, TableRow } from "./types";

export interface StoreState {
  adCopy: AdCopy;
  tableRows: TableRow[];
  updateField: (field: keyof AdCopy, value: string) => void;
  updateAll: (data: AdCopy) => void;
  initializeTableRows: () => void;
  updateTableRow: (rowId: string, field: keyof AdCopy, value: string) => void;
}

export const useAdStore = create<StoreState>((set, get) => ({
  adCopy: {
    headline: "Try Listening to Books Today!",
    description:
      "Tired of reading long texts? 📚👀\nSpeechify reads to you, so you can multitask while learning or relaxing. Available on all devices.",
    callToAction: "Learn More",
    launchAs: "active",
  },
  tableRows: [],

  // Initialize table rows from current adCopy
  initializeTableRows: () => {
    const { adCopy } = get();
    set({
      tableRows: Array.from({ length: 2 }).map((_, i) => ({
        id: `row-${i}`,
        headline: adCopy.headline,
        description: adCopy.description,
        callToAction: adCopy.callToAction,
        launchAs: adCopy.launchAs,
        isCustomized: false,
      })),
    });
  },

  // Update specific table row and mark as customized
  updateTableRow: (rowId: string, field: keyof AdCopy, value: string) => {
    console.log(`Store Updating ${rowId} - ${field}`);
    set((state) => ({
      tableRows: state.tableRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
              isCustomized: true,
            }
          : row
      ),
      // If updating row-0, also update the gallery store
      // ...(rowId === "row-0" && {
      //   adCopy: {
      //     ...state.adCopy,
      //     [field]: value,
      //   },
      // }),
    }));
  },

  updateField: (field: keyof AdCopy, value: string) => {
    console.log(`[Store] 💾 Updating ${field} to:`, value);
    set((state) => ({
      adCopy: { ...state.adCopy, [field]: value },
    }));
  },

  updateAll: (data: AdCopy) => {
    console.log("[Store] 💾 Updating all data:", data);
    set({ adCopy: data });
  },
}));
