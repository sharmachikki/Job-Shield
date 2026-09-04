import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function PublicLayout() {
  const theme = useTheme();
  const accent = theme ? theme.accent : '#B8863B';

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="px-6 py-4 flex justify-between items-center text-white"
        style={{ backgroundColor: 'var(--theme-base)' }}
      >
        <Link to="/" className="font-bold text-lg">Job Easy</Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/jobs">Jobs</Link>
          <Link to="/freelancers">Freelancers</Link>
          <Link to="/trainers">Trainers</Link>
          <Link to="/training">Training</Link>
          <Link to="/manpower">Manpower</Link>
          <Link to="/login">Login</Link>
          <Link
            to="/register"
            className="px-3 py-1 font-semibold"
            style={{ backgroundColor: accent, color: 'var(--theme-base)' }}
          >
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
