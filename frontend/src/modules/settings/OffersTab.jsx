// Read-only preview for now — full CRUD belongs to the pricing module
// (coupons / discounts tables already exist in database/schema.sql);
// this tab just needs to link there once that screen exists.
const MOCK_OFFERS = [
  { name: 'Launch discount — job posting', type: 'Coupon', value: '20% off', validTill: 'Sep 30', status: 'Active' },
  { name: 'Free featured listing — new employers', type: 'Promo banner', value: '1 free / mo', validTill: 'Oct 15', status: 'Active' },
  { name: 'Festive vendor onboarding fee waiver', type: 'Discount', value: '100% off', validTill: 'Sep 12', status: 'Scheduled' },
];

const statusClass = {
  Active: 'bg-green-100 text-green-800',
  Scheduled: 'bg-gray-100 text-gray-600',
  Expired: 'bg-red-100 text-red-700',
};

export default function OffersTab() {
  return (
    <div className="bg-white border">
      <div className="px-5 py-3 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold">Offers &amp; promotional listings</h3>
        <span className="text-xs text-gray-400 font-mono">coupons · discounts</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-400 border-b">
            <th className="px-5 py-2.5">Offer</th>
            <th className="px-5 py-2.5">Type</th>
            <th className="px-5 py-2.5">Value</th>
            <th className="px-5 py-2.5">Valid till</th>
            <th className="px-5 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_OFFERS.map((o) => (
            <tr key={o.name} className="border-b last:border-0">
              <td className="px-5 py-3">{o.name}</td>
              <td className="px-5 py-3">{o.type}</td>
              <td className="px-5 py-3">{o.value}</td>
              <td className="px-5 py-3">{o.validTill}</td>
              <td className="px-5 py-3">
                <span className={`text-xs font-mono px-2 py-0.5 ${statusClass[o.status]}`}>{o.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-5 py-3 border-t">
        <button
          className="text-xs font-semibold px-3 py-1.5 text-white"
          style={{ backgroundColor: 'var(--theme-accent)' }}
        >
          + Add offer
        </button>
      </div>
    </div>
  );
}
