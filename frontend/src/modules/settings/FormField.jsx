export function TextField({ label, value, onChange, hint }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-gray-500">
      {label}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-normal text-gray-900 border px-3 py-2 focus:outline-none focus:ring-2"
        style={{ outlineColor: 'var(--theme-accent)' }}
      />
      {hint && <span className="font-normal text-gray-400">{hint}</span>}
    </label>
  );
}

export function TextAreaField({ label, value, onChange, rows = 3 }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-gray-500">
      {label}
      <textarea
        rows={rows}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-normal text-gray-900 border px-3 py-2 focus:outline-none focus:ring-2 resize-y"
      />
    </label>
  );
}
