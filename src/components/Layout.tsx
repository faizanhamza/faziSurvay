import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Palette,
  Database,
  School,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { currentSchool } = useSchool();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['superadmin', 'admin', 'teacher', 'viewer'] },
    { name: 'School Management', href: '/schools', icon: School, roles: ['superadmin'] },
    { name: 'Portal', href: '/portal', icon: LayoutDashboard, roles: ['admin', 'teacher', 'viewer'] },
    { name: 'Survey Builder', href: '/surveys', icon: FileText, roles: ['admin', 'teacher'] },
    { name: 'Uploads', href: '/uploads', icon: Upload, roles: ['admin', 'teacher'] },
    { name: 'Branding', href: '/branding', icon: Palette, roles: ['admin'] },
    { name: 'Data Management', href: '/data', icon: Database, roles: ['admin'] },
  ];

  const filteredNav = navigation.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {currentSchool?.logo && (
                <img
                  src={currentSchool.logo}
                  alt={currentSchool.name}
                  className="h-10 w-10 object-contain mr-3"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {currentSchool?.name || 'School Portal'}
                </h1>
                {currentSchool?.tagline && (
                  <p className="text-xs text-slate-600">{currentSchool.tagline}</p>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3 pb-3 border-b border-slate-200">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                  {user?.role}
                </span>
              </div>
              {filteredNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
