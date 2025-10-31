/**
 * AD DRAFT CHALLENGE - State Synchronization Problem
 *
 * THE CUSTOMER PROBLEM:
 * You're building an ad drafting tool. Customers can create ads in two modes:
 *
 * 1. GALLERY MODE: Launch 2 ads (one per media) using the SAME copy for both
 * 2. TABLE MODE: Launch 2 ads with UNIQUE copy for each media
 *
 * THE BUG:
 * When a user edits copy in Table Mode (making Row 1 and Row 2 different),
 * then switches to Gallery Mode and back to Table Mode, they lose their
 * unique edits! Both rows get reset to the Gallery copy.
 *
 * YOUR TASK:
 * Fix the state synchronization so that:
 * - Initially: Both views show the same data (synced)
 * - After editing in Table Mode: Each row maintains its unique copy
 * - Switching between views: Doesn't overwrite unique edits
 * - Gallery Mode: Still works for drafting ads with shared copy
 */

'use client';
import React, { useState, useEffect } from 'react';
import { useAdStore } from './store';
import type { ViewMode, AdCopy } from './types';

// ============= GALLERY VIEW COMPONENT =============
/**
 * Gallery View - Used when customer wants to launch ads with SAME copy
 *
 * Shows the ad copy that will be used for both media items.
 * Changes here should save to the store.
 */
const GalleryView = () => {
  const storeData = useAdStore(state => state.adCopy);
  const updateField = useAdStore(state => state.updateField);

  const [localHeadline, setLocalHeadline] = useState(storeData.headline);
  const [localDescription, setLocalDescription] = useState(storeData.description);
  const [localCTA, setLocalCTA] = useState(storeData.callToAction);
  const [localLaunchAs, setLocalLaunchAs] = useState(storeData.launchAs);

  // BUG: This syncs from store on EVERY change, preventing any forking
  useEffect(() => {
    console.log('[Gallery] 🔄 Syncing from store');
    setLocalHeadline(storeData.headline);
    setLocalDescription(storeData.description);
    setLocalCTA(storeData.callToAction);
    setLocalLaunchAs(storeData.launchAs);
  }, [storeData]);

  const handleChange = (field: keyof AdCopy, value: string) => {
    // Update local state
    if (field === 'headline') setLocalHeadline(value);
    if (field === 'description') setLocalDescription(value);
    if (field === 'callToAction') setLocalCTA(value);
    if (field === 'launchAs') setLocalLaunchAs(value as 'active' | 'paused');

    // Save to store immediately
    updateField(field, value);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT COLUMN - Ad Setup (Copy) */}
      <div className="col-span-5 border rounded-lg bg-white shadow-sm p-4">
        <h2 className="text-base font-semibold mb-3">Ad Setup</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Primary Text</label>
            <textarea
              value={localDescription}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter primary text..."
              rows={3}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={localHeadline}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="Enter headline..."
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Call to Action</label>
            <select
              value={localCTA}
              onChange={(e) => handleChange('callToAction', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Download">Download</option>
              <option value="Get Quote">Get Quote</option>
            </select>
          </div>

          <div className="pt-2 border-t">
            <label className="block text-xs font-medium text-gray-700 mb-1">Launch ads as</label>
            <select
              value={localLaunchAs}
              onChange={(e) => handleChange('launchAs', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
          <strong>📢 Same copy will be used for both ads</strong>
        </div>
      </div>

      {/* RIGHT COLUMN - Media Preview */}
      <div className="col-span-7 border rounded-lg bg-white shadow-sm p-4">
        <h2 className="text-base font-semibold mb-3">Ads (2)</h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Media Card 1 */}
          <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors">
            <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
              ✕
            </div>
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <div className="text-4xl">🖼️</div>
            </div>
            <div className="absolute bottom-1.5 right-1.5 flex gap-1">
              <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-xs">
                👁️
              </button>
              <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-xs">
                🎨
              </button>
            </div>
            <div className="p-2 bg-white border-t">
              <div className="text-xs font-medium text-gray-700">Media 1</div>
            </div>
          </div>

          {/* Media Card 2 */}
          <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors">
            <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
              ✕
            </div>
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-4xl">🖼️</div>
            </div>
            <div className="absolute bottom-1.5 right-1.5 flex gap-1">
              <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-xs">
                👁️
              </button>
              <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-xs">
                🎨
              </button>
            </div>
            <div className="p-2 bg-white border-t">
              <div className="text-xs font-medium text-gray-700">Media 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= TABLE VIEW COMPONENT =============
/**
 * Table View - Used when customer wants UNIQUE copy for each media
 *
 * Shows 2 rows (one per media item).
 * Initially both rows show the same data, but user can edit each row independently.
 *
 * BUG: When switching views, all unique edits are lost!
 */
const TableView = () => {
  const storeData = useAdStore(state => state.adCopy);
  const updateField = useAdStore(state => state.updateField);

  // Row 1 - starts with store data
  const [row1Headline, setRow1Headline] = useState(storeData.headline);
  const [row1Description, setRow1Description] = useState(storeData.description);
  const [row1CTA, setRow1CTA] = useState(storeData.callToAction);
  const [row1LaunchAs, setRow1LaunchAs] = useState(storeData.launchAs);

  // Row 2 - starts with SAME data as Row 1
  const [row2Headline, setRow2Headline] = useState(storeData.headline);
  const [row2Description, setRow2Description] = useState(storeData.description);
  const [row2CTA, setRow2CTA] = useState(storeData.callToAction);
  const [row2LaunchAs, setRow2LaunchAs] = useState(storeData.launchAs);

  // BUG: This overwrites ALL rows whenever store changes!
  // This is the problem - when user makes any row unique, then switches to Gallery
  // and back, this effect overwrites all unique edits.
  useEffect(() => {
    console.log('[Table] 📥 Syncing ALL rows from store (OVERWRITES ANY UNIQUE EDITS!)');
    setRow1Headline(storeData.headline);
    setRow1Description(storeData.description);
    setRow1CTA(storeData.callToAction);
    setRow1LaunchAs(storeData.launchAs);

    setRow2Headline(storeData.headline);
    setRow2Description(storeData.description);
    setRow2CTA(storeData.callToAction);
    setRow2LaunchAs(storeData.launchAs);
  }, [storeData]);

  // When Row 1 changes, update the store (so Gallery can see it)
  const handleRow1Change = (field: keyof AdCopy, value: string) => {
    if (field === 'headline') setRow1Headline(value);
    if (field === 'description') setRow1Description(value);
    if (field === 'callToAction') setRow1CTA(value);
    if (field === 'launchAs') setRow1LaunchAs(value as 'active' | 'paused');

    // Update store so Gallery mode can sync
    updateField(field, value);
  };

  // When Row 2 changes, just update local state (don't update store)
  const handleRow2Change = (field: keyof AdCopy, value: string) => {
    if (field === 'headline') setRow2Headline(value);
    if (field === 'description') setRow2Description(value);
    if (field === 'callToAction') setRow2CTA(value);
    if (field === 'launchAs') setRow2LaunchAs(value as 'active' | 'paused');
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left font-semibold text-gray-700 w-32">CREATIVE</th>
              <th className="p-3 text-left font-semibold text-gray-700">PRIMARY TEXT</th>
              <th className="p-3 text-left font-semibold text-gray-700">HEADLINE</th>
              <th className="p-3 text-left font-semibold text-gray-700 w-32">CALL TO ACTION</th>
              <th className="p-3 text-left font-semibold text-gray-700 w-32">LAUNCH AS</th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 - Media 1 */}
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                      SINGLE
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-2">
                <textarea
                  value={row1Description}
                  onChange={(e) => handleRow1Change('description', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter primary text..."
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={row1Headline}
                  onChange={(e) => handleRow1Change('headline', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter headline..."
                />
              </td>
              <td className="p-2">
                <select
                  value={row1CTA}
                  onChange={(e) => handleRow1Change('callToAction', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="Learn More">Learn More</option>
                  <option value="Shop Now">Shop Now</option>
                  <option value="Sign Up">Sign Up</option>
                  <option value="Download">Download</option>
                </select>
              </td>
              <td className="p-2">
                <select
                  value={row1LaunchAs}
                  onChange={(e) => handleRow1Change('launchAs', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </td>
            </tr>

            {/* Row 2 - Media 2 */}
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                      SINGLE
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-2">
                <textarea
                  value={row2Description}
                  onChange={(e) => handleRow2Change('description', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter primary text..."
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={row2Headline}
                  onChange={(e) => handleRow2Change('headline', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter headline..."
                />
              </td>
              <td className="p-2">
                <select
                  value={row2CTA}
                  onChange={(e) => handleRow2Change('callToAction', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="Learn More">Learn More</option>
                  <option value="Shop Now">Shop Now</option>
                  <option value="Sign Up">Sign Up</option>
                  <option value="Download">Download</option>
                </select>
              </td>
              <td className="p-2">
                <select
                  value={row2LaunchAs}
                  onChange={(e) => handleRow2Change('launchAs', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-50 p-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          2 rows selected
        </div>
        <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-2 rounded">
          <strong>⚠️ Try this:</strong> Make any row unique, then switch to Gallery Mode and back. Your unique edits will be lost!
        </div>
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
        🖼️ Gallery Mode
      </button>
      <button
        onClick={() => onChange('table')}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${
          mode === 'table'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        📊 Table Mode
      </button>
    </div>
  );
};

// ============= MAIN APP =============
export default function AdDraftApp() {
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const storeData = useAdStore(state => state.adCopy);

  const handleLaunchAds = () => {
    alert('🚀 Launching 2 ads!\n\nThis is a demo - in real life, these would be submitted to the ad platform.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">
            Ad Draft Challenge: State Sync Problem
          </h1>
          <p className="text-sm text-gray-600">
            Fix the state synchronization bug between Gallery and Table modes
          </p>
        </div>

        {/* Customer Problem - At the top */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
          <h3 className="font-bold text-lg mb-2 text-blue-900">
            🎯 The Customer Problem
          </h3>
          <p className="text-sm mb-3 text-gray-700">
            You're building an ad drafting tool. Customers have <strong>2 media files</strong> and want to create ads:
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-semibold text-blue-700 mb-1">Option 1: Gallery Mode</p>
              <p className="text-gray-700 text-xs">
                Launch 2 ads (one per media) using the <strong>SAME copy</strong> for both.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-semibold text-blue-700 mb-1">Option 2: Table Mode</p>
              <p className="text-gray-700 text-xs">
                Launch 2 ads with <strong>UNIQUE copy</strong> for each media.
              </p>
            </div>
          </div>
        </div>

        <ViewToggle mode={viewMode} onChange={setViewMode} />

        <div className="mb-4">
          {viewMode === 'gallery' ? <GalleryView /> : <TableView />}
        </div>

        {/* Action Buttons */}
        <div className="mb-4 flex items-center justify-end gap-4 bg-white border rounded-lg p-3 shadow-sm">
          <button
            onClick={handleLaunchAds}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
          >
            <span>🚀</span> Launch Ads
          </button>
        </div>

        {/* Global Store State */}
        <div className="p-3 bg-white border rounded-lg shadow-sm">
          <h3 className="font-bold text-base mb-1 text-gray-900">📦 Global Store (Shared State)</h3>
          <p className="text-xs text-gray-600 mb-2">
            This is the source of truth that Gallery mode reads/writes to
          </p>
          <pre className="text-xs bg-gray-50 p-2 rounded border overflow-x-auto font-mono">
            {JSON.stringify(storeData, null, 2)}
          </pre>
        </div>

        {/* Challenge Instructions */}
        <div className="space-y-3 mt-4">
        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
          <h3 className="font-bold text-lg mb-2 text-red-900">
            🐛 The Bug
          </h3>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-3 rounded border border-red-200">
              <p className="font-semibold text-red-700 mb-1.5 text-xs">How to Reproduce:</p>
              <ol className="list-decimal ml-5 space-y-1 text-gray-700 text-xs">
                <li>Go to <strong>Table Mode</strong></li>
                <li>Make any row unique (e.g., change Row 2 headline to "Audiobooks Made Easy!")</li>
                <li>Switch to <strong>Gallery Mode</strong></li>
                <li>Switch back to <strong>Table Mode</strong></li>
                <li>❌ <strong>BUG</strong>: Your unique edits are gone! All rows are identical again.</li>
              </ol>
            </div>

            <div className="bg-white p-3 rounded border border-red-200">
              <p className="font-semibold text-red-700 mb-1.5 text-xs">Why This Is a Problem:</p>
              <p className="text-gray-700 text-xs">
                The customer spent time crafting unique copy for each ad, but switching between
                views causes them to <strong>lose their unique edits</strong>. This is frustrating and
                makes the tool unreliable.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
          <h3 className="font-bold text-lg mb-2 text-green-900">
            ✅ Your Task
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              Fix the state synchronization so that:
            </p>

            <ul className="list-disc ml-5 space-y-1 text-gray-700 text-xs">
              <li>
                <strong>Initially:</strong> Both Gallery and Table modes sync from the store
                (they start with the same data)
              </li>
              <li>
                <strong>When editing in Table Mode:</strong> Each row can "fork" from the store
                and maintain its own unique state
              </li>
              <li>
                <strong>When switching views:</strong> Unique edits in any Table Mode row are preserved
              </li>
              <li>
                <strong>Gallery Mode behavior:</strong> Should still update the store and any rows that haven't been customized
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
          <h3 className="font-bold text-lg mb-2">
            🎓 Success Criteria
          </h3>
          <ul className="list-disc ml-5 space-y-1 text-xs text-gray-700">
            <li>Edit in Gallery Mode → All table rows update ✅</li>
            <li>Edit in Table Mode any row → It stays unique ✅</li>
            <li>Switching back and forth → Unique states are remembered ✅</li>
            <li>Customer doesn't lose their work when switching views ✅</li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
}
