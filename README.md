# React State Sync Challenge

A practical React coding challenge focused on state synchronization between multiple views of the same data.

## Overview

This challenge simulates a real-world scenario: building an ad drafting tool where users can create ads in two different modes (Gallery View and Table View), each with different use cases. The challenge is to fix a critical state synchronization bug that causes users to lose their work when switching between views.

**Your Mission:** Fix the state synchronization logic so that unique edits in Table Mode are preserved when switching between views.

## The Problem

### The Customer Use Case

You're building an ad drafting tool where customers can create ads using two different modes:

1. **Gallery Mode**: Launch 2 ads (one per media) using the **SAME copy** for both ads
2. **Table Mode**: Launch 2 ads with **UNIQUE copy** for each media

### The Bug

When a user:
1. Switches to Table Mode
2. Makes unique edits to any row (e.g., changes Row 2's headline to "Audiobooks Made Easy!")
3. Switches to Gallery Mode
4. Switches back to Table Mode

**❌ The Problem:** All unique edits are lost! Both rows get reset to the same copy from the store.

### Why This Happens

Both `GalleryView` and `TableView` have `useEffect` hooks that sync from the Zustand store on every store change. When you:
- Edit Row 2 in Table Mode → Row 2 gets unique state
- Switch to Gallery Mode → Gallery View syncs from store (still has old data)
- Switch back to Table Mode → Table View's effect runs and overwrites ALL rows with store data

**The store never knew about Row 2's unique edits**, so they get lost when the view re-syncs.

## Your Task

Fix the state synchronization so that:

- ✅ **Initially**: Both Gallery and Table modes sync from the store (they start with the same data)
- ✅ **When editing in Table Mode**: Each row can "fork" from the store and maintain its own unique state
- ✅ **When switching views**: Unique edits in any Table Mode row are preserved
- ✅ **Gallery Mode behavior**: Should still update the store and any rows that haven't been customized

## Getting Started

### Installation

```bash
npm install
```

### Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Tips

1. **Open the browser console** - All state changes are logged for debugging
2. **Test the bug** - Make unique edits in Table Mode, switch views, and watch them disappear
3. **Test the fix** - After fixing, unique edits should persist when switching views
4. **Check the store** - The global store state is displayed at the bottom of the page

## Project Structure

```
app/
├── page.tsx                    # Main page with metadata
└── components/
    ├── AdDraftApp.tsx         # Main component with the state sync bug (FIX THIS!)
    ├── store.ts               # Zustand store (DO NOT MODIFY)
    └── types.ts               # TypeScript types
```

## Success Criteria

After fixing the bug, verify:

- [ ] Edit Row 1 in Table Mode → Row 1 gets unique state
- [ ] Edit Row 2 in Table Mode → Row 2 gets unique state (different from Row 1)
- [ ] Switch to Gallery Mode → Gallery shows store state
- [ ] Switch back to Table Mode → Both rows maintain their unique edits ✅
- [ ] Edit in Gallery Mode → Store updates, and Table Mode rows (that haven't been customized) should sync
- [ ] Customer doesn't lose their work when switching views ✅

## Hints

### Understanding the Problem

- Look at the `useEffect` hooks in both `GalleryView` and `TableView`
- Notice how they sync from `storeData` on every store change
- Think about when syncing should happen vs when it shouldn't
- The key insight: **Once a row has unique edits, it should stop syncing from the store**

### Potential Solutions

- Track which rows have been customized/forked
- Only sync rows that haven't been customized
- Consider using refs or state flags to track "has this row been edited?"
- When should a row sync? Only on initial load, or when explicitly reset?

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Zustand** - State management
- **Tailwind CSS** - Styling

## Learning Objectives

After completing this challenge, you'll understand:

1. **State Forking** - How to manage independent local state that initially syncs from a global store
2. **useEffect Dependencies** - When and when not to sync from global state
3. **State Synchronization Patterns** - Coordinating multiple views of the same data
4. **Preventing Data Loss** - Ensuring user edits aren't accidentally overwritten
5. **React Debugging** - Using console logs and React DevTools to trace state flow

## Common Pitfalls

1. **Syncing too aggressively** - Not every store change should trigger a local state update
2. **Missing the "fork point"** - Once a row becomes unique, it should stop syncing
3. **State update loops** - Be careful not to create circular dependencies
4. **Over-engineering** - The fix can be simpler than you think!

## Need Help?

- Check the detailed comments in `AdDraftApp.tsx` - they explain the bug
- The bug is in the `useEffect` hooks that sync from the store
- The key is to track whether each row has been customized and prevent syncing for customized rows
- Start by understanding when each row should sync vs when it should maintain its own state

## About This Challenge

This challenge was created to test practical React skills that matter in production:

- State management patterns
- Understanding when to sync vs when to fork state
- Preventing data loss in multi-view interfaces
- Building reliable user experiences

Good luck! 🚀
