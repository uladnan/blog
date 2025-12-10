import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, PenTool, LogOut, Globe, Menu, Files, 
  User as UserIcon, Image as ImageIcon, Settings, Layers, 
  Zap, Users, FolderTree 
} from 'lucide-react';
import { store } from '../services/mockStore';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = store.getSettings();
  const theme = store.getThemeConfig();
  const categories = store.getCategories();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight font-serif">
            {settings.general.title || 'Lumina.'}
          </Link>
          <nav className="flex gap-4 md:gap-6">
             <Link to="/" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Home</Link>
             <Link to="/about" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">About</Link>
             <Link to="/admin" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Admin</Link>
          </nav>
        </div>
      </header>
      
      <div className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 flex gap-8">
        {/* Left Sidebar if enabled */}
        {theme.layout === 'sidebar-left' && (
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
             <PublicSidebar settings={settings} categories={categories} />
          </aside>
        )}

        <main className="flex-1 min-w-0">
          {children}
        </main>

        {/* Right Sidebar if enabled (default) */}
        {theme.layout === 'sidebar-right' && (
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
             <PublicSidebar settings={settings} categories={categories} />
          </aside>
        )}
      </div>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.general.title}. All rights reserved.</p>
          {settings.ads.footerSlot && <div dangerouslySetInnerHTML={{__html: settings.ads.footerSlot}} className="mt-4 text-xs bg-gray-100 p-2 inline-block rounded" />}
        </div>
      </footer>
    </div>
  );
};

const PublicSidebar = ({ settings, categories }: { settings: any, categories: any[] }) => (
  <>
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        {categories.map(c => (
           <li key={c.id} className="flex justify-between hover:text-indigo-600 cursor-pointer">
             <span>{c.name}</span>
             <span className="bg-gray-100 text-gray-500 px-2 rounded-full text-xs flex items-center">{c.count}</span>
           </li>
        ))}
      </ul>
    </div>
    {settings.ads.sidebarSlot && (
       <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center text-gray-400 text-sm border border-dashed border-gray-300">
          Advertisement Slot
       </div>
    )}
  </>
);


export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const user = store.getCurrentUser();

  const handleLogout = () => {
    store.logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
          isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-100 font-medium'
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  const NavHeader = ({ label }: { label: string }) => (
    <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col h-full
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <span className="text-xl font-bold text-indigo-600">Lumina CMS</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-0.5 scrollbar-thin">
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          
          <NavHeader label="Content" />
          <NavItem to="/admin/posts/new" icon={PenTool} label="Write New" />
          <NavItem to="/admin/posts" icon={Files} label="All Posts" />
          <NavItem to="/admin/pages" icon={Files} label="Static Pages" />
          <NavItem to="/admin/categories" icon={FolderTree} label="Categories" />
          <NavItem to="/admin/media" icon={ImageIcon} label="Media & Files" />
          
          <NavHeader label="Management" />
          <NavItem to="/admin/users" icon={Users} label="Users & Roles" />
          <NavItem to="/admin/comments" icon={Users} label="Comments" />

          <NavHeader label="System" />
          <NavItem to="/admin/themes" icon={Layers} label="Appearance" />
          <NavItem to="/admin/plugins" icon={Zap} label="Plugins" />
          <NavItem to="/admin/settings" icon={Settings} label="Settings" />
        </div>

        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-sm text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role}</p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-2">
             <Link to="/" className="flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-medium border border-gray-200">
                <Globe size={14} /> Site
             </Link>
             <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium border border-gray-200 hover:border-red-200">
                <LogOut size={14} /> Logout
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-16 bg-white border-b border-gray-200 lg:hidden flex items-center px-4 justify-between sticky top-0 z-10 shrink-0">
          <span className="font-semibold text-gray-700">Admin Panel</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};