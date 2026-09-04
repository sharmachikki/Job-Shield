const SLOTS = [
  { key: 'logoFileId', label: 'Site logo', hint: 'SVG or PNG, 200×60' },
  { key: 'heroImageFileId', label: 'Homepage hero image', hint: 'JPG, 1600×800' },
  { key: 'faviconFileId', label: 'Favicon', hint: 'ICO/PNG, 64×64' },
];

export default function MediaTab({ data, onFileSelect }) {
  return (
    <div className="bg-white border">
      <div className="px-5 py-3 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold">Brand &amp; media assets</h3>
        <span className="text-xs text-gray-400 font-mono">files</span>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SLOTS.map((slot) => (
          <div key={slot.key} className="border p-3 text-center">
            <div
              className="h-20 flex items-center justify-center text-white font-semibold mb-2"
              style={{ backgroundColor: 'var(--theme-base)' }}
            >
              {data[slot.key] ? 'Uploaded' : 'JE'}
            </div>
            <div className="text-sm font-semibold">{slot.label}</div>
            <div className="text-xs text-gray-400 mb-2">{slot.hint}</div>
            <label className="inline-block text-xs font-semibold border px-3 py-1.5 cursor-pointer hover:bg-gray-50">
              Replace
              <input
                type="file"
                className="hidden"
                onChange={(e) => onFileSelect(slot.key, e.target.files && e.target.files[0])}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
