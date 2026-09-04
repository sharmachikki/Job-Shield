import { Outlet, Link } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r p-4 text-sm">
        <div className="font-bold mb-4">Dashboard</div>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard">Overview</Link>
          <Link to="/dashboard/applications">Applications</Link>
          <Link to="/dashboard/projects">Projects</Link>
          <Link to="/dashboard/wallet">Wallet</Link>
          <Link to="/dashboard/messages">Messages</Link>
          <Link to="/dashboard/documents">Documents</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
