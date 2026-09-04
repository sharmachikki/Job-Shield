import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RequireAuth from './RequireAuth';
import { ADMIN_ROLES } from '../constants/roles';

import PublicLayout from '../../layouts/PublicLayout';
import UserLayout from '../../layouts/UserLayout';
import AdminLayout from '../../layouts/AdminLayout';

import Home from '../../pages/public/Home';
import JobsSearch from '../../pages/public/JobsSearch';
import JobDetails from '../../pages/public/JobDetails';
import FreelancersSearch from '../../pages/public/FreelancersSearch';
import FreelancerProfile from '../../pages/public/FreelancerProfile';
import TrainersSearch from '../../pages/public/TrainersSearch';
import TrainingPrograms from '../../pages/public/TrainingPrograms';
import ManpowerServices from '../../pages/public/ManpowerServices';
import Employers from '../../pages/public/Employers';
import About from '../../pages/public/About';
import Contact from '../../pages/public/Contact';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';

import Overview from '../../pages/dashboard/Overview';
import Applications from '../../pages/dashboard/Applications';
import Projects from '../../pages/dashboard/Projects';
import Wallet from '../../pages/dashboard/Wallet';
import Messages from '../../pages/dashboard/Messages';
import Documents from '../../pages/dashboard/Documents';

import AdminDashboard from '../../pages/admin/Dashboard';
import Approvals from '../../pages/admin/Approvals';
import UserManagement from '../../pages/admin/UserManagement';
import Recruitment from '../../pages/admin/Recruitment';
import Marketplace from '../../pages/admin/Marketplace';
import Finance from '../../pages/admin/Finance';
import Disputes from '../../pages/admin/Disputes';
import DocumentsAdmin from '../../pages/admin/DocumentsAdmin';
import Reports from '../../pages/admin/Reports';
import AuditLogs from '../../pages/admin/AuditLogs';
import Settings from '../../pages/admin/Settings';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsSearch />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/freelancers" element={<FreelancersSearch />} />
          <Route path="/freelancers/:id" element={<FreelancerProfile />} />
          <Route path="/trainers" element={<TrainersSearch />} />
          <Route path="/training" element={<TrainingPrograms />} />
          <Route path="/manpower" element={<ManpowerServices />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <UserLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Overview />} />
          <Route path="applications" element={<Applications />} />
          <Route path="projects" element={<Projects />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="messages" element={<Messages />} />
          <Route path="documents" element={<Documents />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth roles={ADMIN_ROLES}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="jobs" element={<Recruitment />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="finance" element={<Finance />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="documents" element={<DocumentsAdmin />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
