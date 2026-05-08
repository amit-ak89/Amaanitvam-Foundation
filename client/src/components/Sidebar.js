import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import {
  FiHome, FiUsers, FiAward, FiLogOut, FiMenu, FiX,
  FiSun, FiMoon, FiChevronRight, FiUpload
} from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
  { label: 'Applications', icon: FiUsers, path: '/admin/applications' },
  { label: 'Certificates', icon: FiAward, path: '/admin/certificates' },
  { label: 'Bulk Upload', icon: FiUpload, path: '/admin/bulk' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { admin, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-forest-700 dark:bg-gray-900 flex flex-col transition-all duration-300 shadow-xl`}
      style={{ background: 'linear-gradient(180deg, #1a472a 0%, #0f2d1a 100%)' }}>

      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-green-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-green-900 text-lg">A</div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Amaanitvam</p>
              <p className="text-green-300 text-xs">Foundation</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-green-300 hover:text-white p-1 rounded transition-colors">
          {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${active ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-800 hover:text-white'}`}>
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{label}</span>
                  {active && <FiChevronRight size={14} />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-green-800 space-y-2">
        <button onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-green-200 hover:bg-green-800 hover:text-white transition-all">
          {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          {!collapsed && <span className="text-sm font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-900">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-green-900 font-bold text-sm">
              {admin?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{admin?.name}</p>
              <p className="text-green-400 text-xs capitalize">{admin?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        )}

        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-900 hover:text-white transition-all">
          <FiLogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
