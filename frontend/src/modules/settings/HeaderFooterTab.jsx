import { TextField } from './FormField';

export default function HeaderFooterTab({ data, onChange }) {
  const setFooter = (key) => (val) => onChange({ ...data, [key]: val });
  const navLinks = data.navLinks || [];

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="bg-white border">
        <div className="px-5 py-3 border-b flex justify-between items-center">
          <h3 className="text-sm font-semibold">Header navigation</h3>
          <span className="text-xs text-gray-400 font-mono">nav_links</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-gray-400 border-b">
              <th className="px-5 py-2.5">Label</th>
              <th className="px-5 py-2.5">Link</th>
              <th className="px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {navLinks.map((link) => (
              <tr key={link.label} className="border-b last:border-0">
                <td className="px-5 py-2.5">{link.label}</td>
                <td className="px-5 py-2.5">{link.url}</td>
                <td className="px-5 py-2.5 text-xs text-gray-400 font-mono">
                  {link.visible ? 'visible' : 'hidden'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t">
          <button className="text-xs font-semibold border px-3 py-1.5 hover:bg-gray-50">+ Add nav link</button>
        </div>
      </div>

      <div className="bg-white border">
        <div className="px-5 py-3 border-b flex justify-between items-center">
          <h3 className="text-sm font-semibold">Footer content</h3>
          <span className="text-xs text-gray-400 font-mono">site_settings</span>
        </div>
        <div className="p-5 grid gap-4">
          <TextField label="Footer tagline" value={data.footerTagline} onChange={setFooter('footerTagline')} />
          <TextField
            label="Footer links (comma separated)"
            value={(data.footerLinks || []).join(', ')}
            onChange={(val) => onChange({ ...data, footerLinks: val.split(',').map((s) => s.trim()).filter(Boolean) })}
          />
          <TextField
            label="Social links (comma separated)"
            value={(data.socialLinks || []).join(', ')}
            onChange={(val) => onChange({ ...data, socialLinks: val.split(',').map((s) => s.trim()).filter(Boolean) })}
          />
        </div>
      </div>
    </div>
  );
}
