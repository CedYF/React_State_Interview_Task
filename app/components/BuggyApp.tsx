/**
 * BUGGY APP - State Fork Challenge
 *
 * This file has 2 main challenges:
 *
 * CHALLENGE #1: Implement State Forking
 * - Currently, Gallery and Table ALWAYS sync from the store
 * - This means any local edits get immediately overwritten
 * - YOUR TASK: Make states "fork" when editing so each view maintains its own local state
 *
 * CHALLENGE #2: Fix the Infinite Loop Bug
 * - There's a special case that causes an infinite update loop
 * - HINT: It involves the link URL field and auto-formatting
 * - Find it and fix it!
 *
 * GOAL:
 * - When NO changes are made: Views sync from store
 * - When changes ARE made: Each view maintains its own local state (forking)
 * - Gallery: Should use debounced saves (500ms)
 * - Table: Should use immediate saves
 * - Fix the infinite loop bug!
 */

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from './buggy-store';
import type { ViewMode, FormData } from './types';

// ============= GALLERY VIEW COMPONENT =============
/**
 * Gallery View - Currently ALWAYS syncs from store (NO FORKING!)
 *
 * CHALLENGE #1: Make this component maintain local state when editing
 * - Right now it syncs from store on every store change
 * - This overwrites any local edits immediately
 * - You need to implement proper forking behavior
 */
const GalleryView = () => {
  const storeData = useStore(state => state.data);
  const updateField = useStore(state => state.updateField);

  // BUG: These are initialized from store but immediately overwritten on any store change!
  const [localHeadline, setLocalHeadline] = useState(storeData.headline);
  const [localCallToAction, setLocalCallToAction] = useState(storeData.callToAction);
  const [localDescription, setLocalDescription] = useState(storeData.description);
  const [localLink, setLocalLink] = useState(storeData.link);

  // Timeouts for debouncing
  const headlineTimeout = useRef<NodeJS.Timeout | null>(null);
  const ctaTimeout = useRef<NodeJS.Timeout | null>(null);
  const descTimeout = useRef<NodeJS.Timeout | null>(null);
  const linkTimeout = useRef<NodeJS.Timeout | null>(null);

  // ============= CHALLENGE #1: NO FORKING! =============
  // BUG: This effect ALWAYS syncs from store, overwriting local edits!
  // The local state gets reset every time the store changes from ANY source
  // This prevents proper forking behavior
  useEffect(() => {
    console.log('[Gallery] 🔄 Syncing ALL fields from store (OVERWRITES LOCAL EDITS!)');
    setLocalHeadline(storeData.headline);
    setLocalCallToAction(storeData.callToAction);
    setLocalDescription(storeData.description);
    setLocalLink(storeData.link);
  }, [storeData]); // This runs on EVERY store change!

  // ============= CHALLENGE #2: CATASTROPHIC INFINITE LOOP BUG! =============
  // This will IMMEDIATELY crash the browser tab when ANY text is in the link field
  // HINT: Link URL validation causes CATASTROPHIC infinite loop
  useEffect(() => {
    // BUG: CATASTROPHIC - runs on EVERY render with NO conditions!
    if (localLink) {
      console.log('[Gallery] 💥 CATASTROPHIC LOOP TRIGGERED!');

      // Always modify the value to ensure it's ALWAYS different
      const timestamp = Date.now() % 2; // Alternates between 0 and 1
      let formattedLink = localLink;

      // Add https:// if missing
      if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
        formattedLink = `https://${formattedLink}`;
      }

      // BUG: ALWAYS toggle trailing slash based on timestamp
      // This ensures value is DIFFERENT on every single render
      if (timestamp === 0) {
        formattedLink = formattedLink.endsWith('/')
          ? formattedLink.slice(0, -1)
          : formattedLink + '/';
      } else {
        formattedLink = formattedLink.endsWith('/')
          ? formattedLink + '/'
          : formattedLink.slice(0, -1) + '/';
      }

      // CATASTROPHIC BUG: Update BOTH local and store with NO debounce!
      // This creates INSTANT infinite loop:
      // 1. setLocalLink triggers this effect IMMEDIATELY
      // 2. updateField triggers sync effect
      // 3. Sync triggers this effect
      // 4. Loop repeats hundreds of times per second
      // 5. Browser runs out of memory and crashes in 1-2 seconds!
      console.log('[Gallery] 🔥 FORCING CATASTROPHIC UPDATE:', formattedLink);
      setLocalLink(formattedLink);
      updateField('link', formattedLink);

      // Make it even worse - update multiple times!
      setTimeout(() => setLocalLink(formattedLink + '/'), 0);
      setTimeout(() => setLocalLink(formattedLink.replace(/\/$/, '')), 0);
    }
  }, [localLink, updateField, storeData.link]); // EVERY dependency triggers it!

  // Debounced save handlers
  const handleHeadlineChange = (value: string) => {
    setLocalHeadline(value);
    if (headlineTimeout.current) clearTimeout(headlineTimeout.current);
    headlineTimeout.current = setTimeout(() => {
      console.log('[Gallery] ⏰ Headline debounced save:', value);
      updateField('headline', value);
    }, 500);
  };

  const handleCTAChange = (value: string) => {
    setLocalCallToAction(value);
    if (ctaTimeout.current) clearTimeout(ctaTimeout.current);
    ctaTimeout.current = setTimeout(() => {
      console.log('[Gallery] ⏰ CTA debounced save:', value);
      updateField('callToAction', value);
    }, 500);
  };

  const handleDescriptionChange = (value: string) => {
    setLocalDescription(value);
    if (descTimeout.current) clearTimeout(descTimeout.current);
    descTimeout.current = setTimeout(() => {
      console.log('[Gallery] ⏰ Description debounced save:', value);
      updateField('description', value);
    }, 500);
  };

  const handleLinkChange = (value: string) => {
    setLocalLink(value);
    if (linkTimeout.current) clearTimeout(linkTimeout.current);
    linkTimeout.current = setTimeout(() => {
      console.log('[Gallery] ⏰ Link debounced save:', value);
      updateField('link', value);
    }, 500);
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Gallery View 🖼️</h2>
 

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Headline</label>
          <input
            type="text"
            value={localHeadline}
            onChange={(e) => handleHeadlineChange(e.target.value)}
            placeholder="Enter headline..."
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Call to Action</label>
          <input
            type="text"
            value={localCallToAction}
            onChange={(e) => handleCTAChange(e.target.value)}
            placeholder="Shop Now, Learn More"
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={localDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter description..."
            rows={3}
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Link URL</label>
          <input
            type="text"
            value={localLink}
            onChange={(e) => handleLinkChange(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono space-y-1">
        <div className="font-bold text-gray-800 mb-2">Gallery Local State:</div>
        <div><span className="text-gray-600">Headline:</span> "{localHeadline}"</div>
        <div><span className="text-gray-600">Call to Action:</span> "{localCallToAction}"</div>
        <div><span className="text-gray-600">Description:</span> "{localDescription.substring(0, 50)}{localDescription.length > 50 ? '...' : ''}"</div>
        <div><span className="text-gray-600">Link:</span> "{localLink}"</div>

        <div className="mt-2 pt-2 border-t border-gray-300">
          {JSON.stringify({
            headline: localHeadline,
            callToAction: localCallToAction,
            description: localDescription,
            link: localLink,
          }) !== JSON.stringify(storeData) ? (
            <span className="text-orange-600 font-bold">⚠️ Unsaved changes (but will get overwritten!)</span>
          ) : (
            <span className="text-green-600">✅ Synced with store</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ============= TABLE VIEW COMPONENT =============
/**
 * Table View - Currently ALWAYS syncs from store (NO FORKING!)
 *
 * CHALLENGE #1: Make this component maintain local state when editing
 * Same issue as Gallery view
 */
const TableView = () => {
  const storeData = useStore(state => state.data);
  const updateField = useStore(state => state.updateField);

  const [localHeadline, setLocalHeadline] = useState(storeData.headline);
  const [localCallToAction, setLocalCallToAction] = useState(storeData.callToAction);
  const [localDescription, setLocalDescription] = useState(storeData.description);
  const [localLink, setLocalLink] = useState(storeData.link);

  // BUG: Same issue - ALWAYS syncs, no forking!
  useEffect(() => {
    console.log('[Table] 📥 Syncing ALL fields from store (OVERWRITES LOCAL EDITS!)');
    setLocalHeadline(storeData.headline);
    setLocalCallToAction(storeData.callToAction);
    setLocalDescription(storeData.description);
    setLocalLink(storeData.link);
  }, [storeData]);

  const handleChange = (field: keyof FormData, value: string) => {
    console.log(`[Table] ✍️ Immediate save ${field}:`, value);

    switch (field) {
      case 'headline':
        setLocalHeadline(value);
        break;
      case 'callToAction':
        setLocalCallToAction(value);
        break;
      case 'description':
        setLocalDescription(value);
        break;
      case 'link':
        setLocalLink(value);
        break;
    }

    updateField(field, value);
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Table View 📊</h2>
     

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left font-semibold">Headline</th>
              <th className="border p-2 text-left font-semibold">Call to Action</th>
              <th className="border p-2 text-left font-semibold">Description</th>
              <th className="border p-2 text-left font-semibold">Link URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">
                <input
                  type="text"
                  value={localHeadline}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="Headline..."
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={localCallToAction}
                  onChange={(e) => handleChange('callToAction', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="CTA..."
                />
              </td>
              <td className="border p-2">
                <textarea
                  value={localDescription}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="Description..."
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={localLink}
                  onChange={(e) => handleChange('link', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="https://..."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono">
        <div className="font-bold mb-2">Table Local State:</div>
        <pre className="text-xs">{JSON.stringify({
          headline: localHeadline,
          callToAction: localCallToAction,
          description: localDescription,
          link: localLink,
        }, null, 2)}</pre>
      </div>
    </div>
  );
};

// ============= VIEW TOGGLE =============
const ViewToggle = ({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onChange('gallery')}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${
          mode === 'gallery'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        🖼️ Gallery View
      </button>
      <button
        onClick={() => onChange('table')}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${
          mode === 'table'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        📊 Table View
      </button>
    </div>
  );
};

// ============= MAIN APP =============
export default function BuggyApp() {
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const storeData = useStore(state => state.data);
  const updateAll = useStore(state => state.updateAll);

  // Sample data presets
  const loadDefaults = (preset: string) => {
    switch (preset) {
      case 'ad1':
        updateAll({
          headline: 'Summer Sale - 50% Off',
          callToAction: 'Shop Now',
          description: 'Limited time offer on all summer items. Free shipping on orders over $50.',
          link: '',
        });
        break;
      case 'ad2':
        updateAll({
          headline: 'New Product Launch',
          callToAction: 'Learn More',
          description: 'Introducing our revolutionary new product that will change your life.',
          link: '',
        });
        break;
      case 'ad3':
        updateAll({
          headline: 'Join Our Community',
          callToAction: 'Sign Up Free',
          description: 'Connect with thousands of members and get exclusive benefits.',
          link: '',
        });
        break;
      case 'clear':
        updateAll({
          headline: '',
          callToAction: '',
          description: '',
          link: '',
        });
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">
        State Fork Challenge
      </h1>
      <p className="text-gray-600 mb-4">
        Two challenges: Implement state forking + Fix the infinite loop bug
      </p>

      {/* Load Defaults Dropdown */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-purple-900">📦 Load Global State:</label>
          <select
            onChange={(e) => loadDefaults(e.target.value)}
            className="px-4 py-2 border border-purple-300 rounded-md bg-white text-sm font-medium hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            defaultValue=""
          >
            <option value="" disabled>Select a preset...</option>
            <option value="ad1">Ad Example 1 - Summer Sale</option>
            <option value="ad2">Ad Example 2 - Product Launch</option>
            <option value="ad3">Ad Example 3 - Community</option>
            <option value="clear">Clear All Data</option>
          </select>
          <span className="text-xs text-purple-700">
            ← Load sample data into global store. Both views will sync to this initially.
          </span>
        </div>
      </div>

      <ViewToggle mode={viewMode} onChange={setViewMode} />

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div>
          {viewMode === 'gallery' ? <GalleryView /> : <TableView />}
        </div>

        {/* Global Store State */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-bold text-lg mb-2 text-purple-900">📦 Global Store State</h3>
          <p className="text-xs text-purple-700 mb-2">
            The "source of truth" - both views currently ALWAYS sync from this
          </p>
          <pre className="text-xs bg-white p-3 rounded border border-purple-200 overflow-x-auto">
            {JSON.stringify(storeData, null, 2)}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-300">
          <h3 className="font-bold text-xl mb-3 text-blue-900">
            🎯 Challenge #1: Implement State Forking
          </h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white p-3 rounded border border-blue-200">
              <strong className="text-blue-700">Current Behavior (BROKEN):</strong>
              <ul className="text-xs text-gray-700 mt-2 space-y-1 list-disc ml-4">
                <li>Both views ALWAYS sync from the store</li>
                <li>Local edits get immediately overwritten</li>
                <li>Try it: Type in Gallery, then immediately type in Table</li>
                <li>Notice how your Gallery edits disappear!</li>
              </ul>
            </div>

            <div className="bg-white p-3 rounded border border-blue-200">
              <strong className="text-blue-700">Goal (What You Need to Implement):</strong>
              <ul className="text-xs text-gray-700 mt-2 space-y-1 list-disc ml-4">
                <li><strong>No changes:</strong> Views sync from store</li>
                <li><strong>When editing:</strong> Each view maintains its own local state</li>
                <li><strong>Gallery:</strong> Debounced saves (500ms delay)</li>
                <li><strong>Table:</strong> Immediate saves (no delay)</li>
                <li><strong>View switch:</strong> Should show latest SAVED state only</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
              <strong className="text-yellow-900">💡 Hints:</strong>
              <ul className="text-xs text-gray-700 mt-2 space-y-1 list-disc ml-4">
                <li>Look at the useEffect that syncs from storeData</li>
                <li>When should it sync? When shouldn't it?</li>
                <li>Consider tracking whether user is editing</li>
                <li>Think about component mount vs. updates</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
          <h3 className="font-bold text-xl mb-3 text-red-900">
            🐛 Challenge #2: Fix Infinite Loop Bug
          </h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white p-3 rounded border border-red-200">
              <strong className="text-red-700">How to Reproduce:</strong>
              <ol className="text-xs text-gray-700 mt-2 space-y-1 list-decimal ml-4">
                <li>Go to Gallery view</li>
                <li>Enter a link <strong>without https://</strong> (e.g., "example.com")</li>
                <li>Watch the console explode! 💥</li>
                <li>The page becomes unresponsive</li>
              </ol>
            </div>

            <div className="bg-white p-3 rounded border border-red-200">
              <strong className="text-red-700">What's Happening:</strong>
              <ul className="text-xs text-gray-700 mt-2 space-y-1 list-disc ml-4">
                <li>Link without https:// triggers auto-formatting</li>
                <li>Auto-format adds "https://" prefix</li>
                <li>This updates the store</li>
                <li>Store update triggers sync effect</li>
                <li>Sync effect resets link from store</li>
                <li>This triggers auto-format validation again...</li>
                <li><strong>INFINITE LOOP!</strong></li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
              <strong className="text-yellow-900">💡 Hints:</strong>
              <ul className="text-xs text-gray-700 mt-2 space-y-1 list-disc ml-4">
                <li>Look for the link URL validation effect</li>
                <li>It auto-adds https:// if missing</li>
                <li>Think about effect dependencies</li>
                <li>Consider: when should the validation run?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded border border-green-300">
        <h3 className="font-bold mb-2 text-green-900">✅ Success Criteria</h3>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-sm text-green-900 mb-1">Challenge #1: State Forking</p>
            <ul className="text-sm space-y-1 list-disc ml-5 text-gray-700">
              <li>States should <strong>sync from store</strong> when views are switched</li>
              <li>States should <strong>fork</strong> when user makes changes (stop syncing while editing)</li>
              <li>Each view maintains its own local edits without overwriting the other</li>
      
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm text-green-900 mb-1">Challenge #2: Fix Infinite Rendering</p>
            <ul className="text-sm space-y-1 list-disc ml-5 text-gray-700">     
              <li>Fix the loop so link validation works without crashing</li>
              <li>Page should remain stable and responsive with any link input</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
