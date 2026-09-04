const TABS = [
  { id: 'content', label: 'Site content' },
  { id: 'media', label: 'Media & images' },
  { id: 'offers', label: 'Offers & promotions' },
  { id: 'headerfooter', label: 'Header & footer' },
  { id: 'theme', label: 'Theme' },
];

export default function Tabs({ active, onChange }) {
  return (
    <div className="flex gap-1 border-b mb-5 flex-wrap">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-semibold -mb-px border-b-2 ${
            active === tab.id
              ? 'border-current text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          style={active === tab.id ? { color: 'var(--theme-base)', borderColor: 'var(--theme-accent)' } : undefined}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
