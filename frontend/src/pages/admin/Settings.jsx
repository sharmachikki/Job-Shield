import { useEffect, useState } from 'react';
import Tabs from '../../modules/settings/Tabs';
import ContentTab from '../../modules/settings/ContentTab';
import MediaTab from '../../modules/settings/MediaTab';
import OffersTab from '../../modules/settings/OffersTab';
import HeaderFooterTab from '../../modules/settings/HeaderFooterTab';
import ThemeTab from '../../modules/settings/ThemeTab';
import { useTheme } from '../../context/ThemeContext';
import { settingsService } from '../../services/settings.service';

const DEFAULTS = {
  heroHeading: 'One platform. Five ways to put people to work.',
  heroSubtext:
    'Post a job, hire a freelancer, book a trainer, or request deployed manpower — every listing runs through the same central approval, pricing, and payment engine.',
  aboutCopy: 'Job Easy connects employers, freelancers, trainers, and manpower vendors on one verified, centrally governed platform.',
  supportEmail: 'support@jobeasy.example',
  logoFileId: null,
  heroImageFileId: null,
  faviconFileId: null,
  navLinks: [
    { label: 'Jobs', url: '/jobs', visible: true },
    { label: 'Freelancers', url: '/freelancers', visible: true },
    { label: 'Trainers', url: '/trainers', visible: true },
    { label: 'Manpower', url: '/manpower', visible: true },
  ],
  footerTagline: 'Hiring, freelancing, training, and manpower — verified end to end.',
  footerLinks: ['About', 'Contact', 'Terms', 'Privacy'],
  socialLinks: ['linkedin.com/company/jobeasy', 'twitter.com/jobeasy'],
  themeAccent: '#B8863B',
  themeBase: '#14213D',
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('content');
  const [data, setData] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const theme = useTheme();

  // Load the real record from GET /settings/admin; fall back to the seed
  // defaults above if the API isn't reachable yet (e.g. backend not running).
  useEffect(() => {
    settingsService
      .getAdmin()
      .then((res) => {
        if (res && res.data) {
          setData((prev) => ({ ...prev, ...res.data }));
          if (res.data.themeAccent) theme.setAccent(res.data.themeAccent);
          if (res.data.themeBase) theme.setBase(res.data.themeBase);
        }
      })
      .catch(() => {
        // Backend not wired up yet — keep the defaults, still fully usable to preview.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (key, file) => {
    if (!file) return;
    // Real upload wiring goes through POST /files (multer) once that endpoint
    // exists — for now just mark the slot as filled in the preview.
    setData((prev) => ({ ...prev, [key]: `local:${file.name}` }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.update(data);
      setToast('Changes saved');
    } catch (err) {
      setToast('Could not reach the server — changes kept locally only');
    } finally {
      setSaving(false);
      setTimeout(() => setToast(''), 2500);
    }
  };

  const handleDiscard = () => setData(DEFAULTS);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Site settings</h2>
        <div className="text-sm text-gray-500">
          Signed in as <strong className="text-gray-900">Admin — Operations</strong>
        </div>
      </div>

      <Tabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'content' && <ContentTab data={data} onChange={setData} />}
      {activeTab === 'media' && <MediaTab data={data} onFileSelect={handleFileSelect} />}
      {activeTab === 'offers' && <OffersTab />}
      {activeTab === 'headerfooter' && <HeaderFooterTab data={data} onChange={setData} />}
      {activeTab === 'theme' && <ThemeTab data={data} onChange={setData} />}

      <div className="flex justify-end items-center gap-3 mt-4">
        {toast && <span className="text-xs font-semibold text-green-700 mr-auto">{toast}</span>}
        <button onClick={handleDiscard} className="text-sm font-semibold border px-4 py-2 hover:bg-gray-50">
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm font-semibold px-4 py-2 text-white disabled:opacity-60"
          style={{ backgroundColor: 'var(--theme-base)' }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
