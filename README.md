# React State Sync Challenge

A practical React coding challenge focused on state management, useEffect dependencies, and debugging real-world synchronization bugs.

## Overview

This challenge simulates a common real-world scenario: building a form that can be viewed in multiple ways (Gallery View and Table View), where each view needs to maintain its own local state while still syncing with a global Zustand store.

**Your Mission:** Fix 2 critical bugs in state synchronization logic.

## The Challenge

### Challenge 1: Implement State Forking

**Current Broken Behavior:**
- Both views ALWAYS sync from the store on every store change
- Local edits get immediately overwritten when the other view saves
- Try it: Type in Gallery, then immediately type in Table - your Gallery edits vanish!

**What You Need to Fix:**
- When NO changes are made: Views should sync from store
- When changes ARE made: Each view should maintain its own local state (forking)
- Gallery View: Should use debounced saves (500ms delay)
- Table View: Should use immediate saves
- When switching views: Should show the latest SAVED state only

**Why This Matters:** This is a common pattern in production apps with multiple synchronized views (think Google Docs, Notion, Figma). Understanding state forking prevents user frustration and data loss.

### Challenge 2: Fix the Catastrophic Infinite Loop Bug

**How to Reproduce:**
1. Open the app in Gallery View
2. Enter ANY text in the Link URL field
3. Watch your browser tab freeze and crash within 2 seconds

**What's Happening:**
- Link validation auto-formats URLs (adds `https://` prefix, toggles trailing slash)
- The validation runs on EVERY render with NO guards
- It updates BOTH local state AND store simultaneously
- Store update triggers sync effect, which triggers validation again
- Loop repeats hundreds of times per second until browser crashes

**What You Need to Fix:**
- Identify the problematic useEffect
- Add proper guards/conditions to prevent infinite loops
- Link validation should work without causing re-renders
- Page should remain responsive with any link input

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
2. **Test both views** - Make sure Gallery and Table views work independently
3. **Test the infinite loop** - Try entering "example.com" in Gallery's Link URL field
4. **Watch the console logs** - They'll help you understand the update cycle

## Project Structure

```
app/
├── page.tsx                    # Main page with metadata
└── components/
    ├── BuggyApp.tsx           # Main component with both bugs (FIX THIS!)
    ├── buggy-store.ts         # Zustand store (DO NOT MODIFY)
    └── types.ts               # TypeScript types
```

## Success Criteria

### Challenge 1: State Forking
- [ ] Edit Gallery view → Switch to Table → Gallery edits are preserved
- [ ] Edit Table view → Switch to Gallery → Table edits are preserved
- [ ] Load preset data → Both views sync to the new state
- [ ] Each view maintains its own local edits without interfering with the other
- [ ] Gallery uses debounced saves (500ms delay)
- [ ] Table uses immediate saves (no delay)

### Challenge 2: Infinite Loop Fix
- [ ] Enter "example.com" in Gallery Link URL → No crash
- [ ] Link auto-formatting works correctly (adds https://)
- [ ] Page remains responsive and stable
- [ ] Console doesn't show repeated update loops
- [ ] Link validation happens only when necessary

## Hints

### For Challenge 1 (State Forking)
- Look at the `useEffect` that syncs from `storeData`
- When should it sync? When shouldn't it?
- Consider tracking whether the user is currently editing
- Think about component mount vs. updates
- What's the difference between "initial load" and "store changed from elsewhere"?

### For Challenge 2 (Infinite Loop)
- Search for the link URL validation effect
- Look at its dependencies array
- What triggers this effect? Should it trigger that often?
- How can you prevent it from running on its own updates?
- Consider: should validation happen on every render?

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Zustand** - State management
- **Tailwind CSS** - Styling

## Learning Objectives

After completing this challenge, you'll understand:

1. **State Forking** - How to manage independent local state that syncs from a global store
2. **useEffect Dependencies** - How to avoid infinite loops and unnecessary re-renders
3. **Debounced State Updates** - Implementing delayed saves for better UX
4. **State Synchronization** - Coordinating multiple views of the same data
5. **React Debugging** - Using console logs and React DevTools to trace state flow

## Common Pitfalls

1. **Syncing too aggressively** - Not every store change should trigger a local state update
2. **Missing dependencies** - Or having too many dependencies in useEffect
3. **State update loops** - Updating state in an effect that depends on that state
4. **Closure issues** - Using stale values in callbacks and effects
5. **Over-engineering** - The fixes are simpler than you think!

## Need Help?

- Check the detailed comments in `BuggyApp.tsx`
- The bugs are intentionally obvious once you know where to look
- Start with Challenge 2 (infinite loop) - it's more straightforward
- Then tackle Challenge 1 (state forking) - it requires more thought

## About This Challenge

This challenge was created to test practical React skills that matter in production:
- State management patterns
- Understanding React's rendering cycle
- Debugging useEffect issues
- Building multi-view interfaces

Good luck! 🚀
