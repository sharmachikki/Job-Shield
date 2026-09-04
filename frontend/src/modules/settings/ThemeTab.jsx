import { useTheme } from '../../context/ThemeContext';

const PRESETS = [
  { label: 'Ink & gold', base: '#14213D', accent: '#B8863B' },
  { label: 'Charcoal & sage', base: '#1F2937', accent: '#3F7D58' },
  { label: 'Maroon & amber', base: '#3D1F2B', accent: '#C99A3A' },
  { label: 'Navy & blue', base: '#101828', accent: '#5B7FDB' },
];

export default function ThemeTab({ data, onChange }) {
  const theme = useTheme();

  // Live preview: update CSS vars immediately via ThemeContext, and stage
  // the value into the form data that gets sent on Save.
  const applyAccent = (hex) => {
    theme.setAccent(hex);
    onChange({ ...data, themeAccent: hex });
  };
  const applyBase = (hex) => {
    theme.setBase(hex);
    onChange({ ...data, themeBase: hex });
  };
  const applyPreset = (preset) => {
    theme.setTheme(preset.accent, preset.base);
    onChange({ ...data, themeAccent: preset.accent, themeBase: preset.base });
  };

  return (
    <div className="bg-white border">
      <div className="px-5 py-3 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold">Site theme</h3>
        <span className="text-xs text-gray-400 font-mono">applies platform-wide</span>
      </div>
      <div className="p-5 grid sm:grid-cols-3 gap-6">
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2">Accent color</div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.themeAccent || '#B8863B'}
              onChange={(e) => applyAccent(e.target.value)}
              className="w-11 h-8 border p-0 cursor-pointer"
            />
            <span className="text-xs font-mono">{(data.themeAccent || '#B8863B').toUpperCase()}</span>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2">Base / ink color</div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.themeBase || '#14213D'}
              onChange={(e) => applyBase(e.target.value)}
              className="w-11 h-8 border p-0 cursor-pointer"
            />
            <span className="text-xs font-mono">{(data.themeBase || '#14213D').toUpperCase()}</span>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2">Presets</div>
          <div className="flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                title={p.label}
                onClick={() => applyPreset(p)}
                className="w-9 h-9 border"
                style={{ background: `linear-gradient(135deg, ${p.base} 50%, ${p.accent} 50%)` }}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="px-5 pb-5 text-xs text-gray-500">
        Changes apply live across the public site and admin console as you pick a color —
        try switching to the public pages to see it. Nothing persists until you hit Save changes.
      </p>
    </div>
  );
}
