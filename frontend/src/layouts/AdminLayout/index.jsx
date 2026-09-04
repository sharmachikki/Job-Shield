import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const { pathname } = useLocation();

  const linkClass = (to) =>
    `px-2 py-1.5 rounded ${pathname === to ? 'text-white font-semibold' : 'text-white/70 hover:text-white'}`;
  const linkStyle = (to) => (pathname === to ? { backgroundColor: 'var(--theme-accent)' } : undefined);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 p-4 text-sm text-white" style={{ backgroundColor: 'var(--theme-base)' }}>
        <div className="font-bold mb-4">Admin</div>
        <nav className="flex flex-col gap-1">
          <Link className={linkClass('/admin')} style={linkStyle('/admin')} to="/admin">Dashboard</Link>
          <Link className={linkClass('/admin/approvals')} style={linkStyle('/admin/approvals')} to="/admin/approvals">Approvals</Link>
          <Link className={linkClass('/admin/users')} style={linkStyle('/admin/users')} to="/admin/users">User Management</Link>
          <Link className={linkClass('/admin/jobs')} style={linkStyle('/admin/jobs')} to="/admin/jobs">Recruitment</Link>
          <Link className={linkClass('/admin/marketplace')} style={linkStyle('/admin/marketplace')} to="/admin/marketplace">Marketplace</Link>
          <Link className={linkClass('/admin/finance')} style={linkStyle('/admin/finance')} to="/admin/finance">Finance</Link>
          <Link className={linkClass('/admin/disputes')} style={linkStyle('/admin/disputes')} to="/admin/disputes">Disputes</Link>
          <Link className={linkClass('/admin/documents')} style={linkStyle('/admin/documents')} to="/admin/documents">Documents</Link>
          <Link className={linkClass('/admin/reports')} style={linkStyle('/admin/reports')} to="/admin/reports">Reports</Link>
          <Link className={linkClass('/admin/audit-logs')} style={linkStyle('/admin/audit-logs')} to="/admin/audit-logs">Audit Logs</Link>
          <Link className={linkClass('/admin/settings')} style={linkStyle('/admin/settings')} to="/admin/settings">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
