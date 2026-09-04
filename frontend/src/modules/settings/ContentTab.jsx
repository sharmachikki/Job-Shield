import { TextField, TextAreaField } from './FormField';

export default function ContentTab({ data, onChange }) {
  const set = (key) => (val) => onChange({ ...data, [key]: val });

  return (
    <div className="bg-white border">
      <div className="px-5 py-3 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold">Homepage content</h3>
        <span className="text-xs text-gray-400 font-mono">site_settings</span>
      </div>
      <div className="p-5 grid gap-4">
        <TextField label="Hero heading" value={data.heroHeading} onChange={set('heroHeading')} />
        <TextAreaField label="Hero subtext" value={data.heroSubtext} onChange={set('heroSubtext')} rows={3} />
        <TextAreaField label="About page copy" value={data.aboutCopy} onChange={set('aboutCopy')} rows={4} />
        <TextField label="Support contact email" value={data.supportEmail} onChange={set('supportEmail')} />
      </div>
    </div>
  );
}
