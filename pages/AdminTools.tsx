import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/Layout';
import { store } from '../services/mockStore';
import { Role, MediaItem, SiteSettings, User, Category } from '../types';
import { Upload, Trash2, Save, User as UserIcon, Shield, Check, Plus, Folder, Image as ImageIcon } from 'lucide-react';

// --- MEDIA MANAGER ---
export const MediaManager: React.FC = () => {
  const [media, setMedia] = useState(store.getMedia());

  const handleUpload = () => {
    // Simulating upload
    const id = crypto.randomUUID();
    const newItem: MediaItem = {
      id,
      url: `https://picsum.photos/seed/${id}/800/600`,
      filename: `upload_${id.substring(0, 6)}.jpg`,
      type: 'image',
      uploaded_at: new Date().toISOString()
    };
    store.addMedia(newItem);
    setMedia(store.getMedia());
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <button onClick={handleUpload} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
          <Upload size={18} /> Upload New
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map(item => (
          <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col p-2 text-center">
               <span className="text-white text-xs break-all mb-2">{item.filename}</span>
               <button className="text-red-400 hover:text-red-200"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

// --- USER MANAGER ---
export const UserManager: React.FC = () => {
  const [users, setUsers] = useState(store.getUsers());

  const handleRoleChange = (id: string, newRole: Role) => {
    const user = users.find(u => u.id === id);
    if (user) {
      store.saveUser({ ...user, role: newRole });
      setUsers([...store.getUsers()]);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users & Roles</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                     {user.avatar_url && <img src={user.avatar_url} alt="" />}
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    className="border-gray-300 rounded-md text-sm py-1 pl-2 pr-8"
                  >
                    {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-red-500 hover:text-red-700 font-medium text-xs">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

// --- SETTINGS ---
export const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(store.getSettings());
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    store.saveSettings(settings);
    alert('Settings Saved!');
  };

  const updateSetting = (section: keyof SiteSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'seo', label: 'SEO' },
    { id: 'smtp', label: 'Email (SMTP)' },
    { id: 'ads', label: 'Ads' },
    { id: 'agc', label: 'AGC & RSS' },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                <input type="text" value={settings.general.title} onChange={e => updateSetting('general', 'title', e.target.value)} className="w-full border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                <input type="text" value={settings.general.description} onChange={e => updateSetting('general', 'description', e.target.value)} className="w-full border-gray-300 rounded-md" />
              </div>
            </div>
          )}

          {activeTab === 'smtp' && (
             <div className="space-y-4 max-w-xl">
               <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" checked={settings.smtp.enabled} onChange={e => updateSetting('smtp', 'enabled', e.target.checked)} id="smtp_en" />
                  <label htmlFor="smtp_en" className="text-sm font-medium text-gray-700">Enable SMTP</label>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                   <input type="text" value={settings.smtp.host} onChange={e => updateSetting('smtp', 'host', e.target.value)} className="w-full border-gray-300 rounded-md" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                   <input type="text" value={settings.smtp.port} onChange={e => updateSetting('smtp', 'port', e.target.value)} className="w-full border-gray-300 rounded-md" />
                 </div>
               </div>
             </div>
          )}
          
          {activeTab === 'ads' && (
             <div className="space-y-4 max-w-xl">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Header Slot (HTML)</label>
                   <textarea rows={3} value={settings.ads.headerSlot} onChange={e => updateSetting('ads', 'headerSlot', e.target.value)} className="w-full border-gray-300 rounded-md font-mono text-xs" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Sidebar Slot (HTML)</label>
                   <textarea rows={3} value={settings.ads.sidebarSlot} onChange={e => updateSetting('ads', 'sidebarSlot', e.target.value)} className="w-full border-gray-300 rounded-md font-mono text-xs" />
                </div>
             </div>
          )}
          
          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-xl">
               <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" checked={settings.seo.searchEngineVisible} onChange={e => updateSetting('seo', 'searchEngineVisible', e.target.checked)} id="seo_vis" />
                  <label htmlFor="seo_vis" className="text-sm font-medium text-gray-700">Allow Search Engines</label>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Global Keywords</label>
                 <input type="text" value={settings.seo.metaKeywords} onChange={e => updateSetting('seo', 'metaKeywords', e.target.value)} className="w-full border-gray-300 rounded-md" />
               </div>
            </div>
          )}

          {activeTab === 'agc' && (
             <div className="space-y-4 max-w-xl">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 mb-4">
                   AGC (Auto Generated Content) fetches articles from an external RSS feed automatically.
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" checked={settings.agc.enabled} onChange={e => updateSetting('agc', 'enabled', e.target.checked)} id="agc_en" />
                  <label htmlFor="agc_en" className="text-sm font-medium text-gray-700">Enable AGC</label>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Source RSS URL</label>
                 <input type="text" placeholder="https://example.com/feed.xml" value={settings.agc.rssSourceUrl} onChange={e => updateSetting('agc', 'rssSourceUrl', e.target.value)} className="w-full border-gray-300 rounded-md" />
               </div>
             </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// --- CATEGORIES ---
export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(store.getCategories());

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
          <Plus size={18} /> New Category
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Post Count</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map(cat => (
              <tr key={cat.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4">
                   <span className="bg-gray-100 px-2 py-1 rounded text-xs">{cat.count} posts</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:underline mr-4">Edit</button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

// --- THEME & PLUGINS ---
export const ThemeManager: React.FC = () => {
  const [theme, setTheme] = useState(store.getThemeConfig());

  const handleUpdate = (key: string, val: any) => {
     const newTheme = { ...theme, [key]: val };
     setTheme(newTheme);
     store.saveThemeConfig(newTheme);
  };

  return (
    <AdminLayout>
       <h1 className="text-2xl font-bold text-gray-900 mb-6">Appearance & Themes</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-lg mb-4">Layout Options</h3>
             <div className="space-y-4">
                <div 
                  onClick={() => handleUpdate('layout', 'sidebar-right')}
                  className={`p-4 border rounded-lg cursor-pointer flex gap-4 items-center ${theme.layout === 'sidebar-right' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                >
                   <div className="w-16 h-10 bg-gray-200 rounded flex gap-1 p-1">
                      <div className="flex-1 bg-white rounded"></div>
                      <div className="w-4 bg-gray-400 rounded"></div>
                   </div>
                   <span className="font-medium">Right Sidebar (Default)</span>
                </div>
                <div 
                   onClick={() => handleUpdate('layout', 'sidebar-left')}
                   className={`p-4 border rounded-lg cursor-pointer flex gap-4 items-center ${theme.layout === 'sidebar-left' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                >
                   <div className="w-16 h-10 bg-gray-200 rounded flex gap-1 p-1">
                      <div className="w-4 bg-gray-400 rounded"></div>
                      <div className="flex-1 bg-white rounded"></div>
                   </div>
                   <span className="font-medium">Left Sidebar</span>
                </div>
                <div 
                   onClick={() => handleUpdate('layout', 'no-sidebar')}
                   className={`p-4 border rounded-lg cursor-pointer flex gap-4 items-center ${theme.layout === 'no-sidebar' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                >
                   <div className="w-16 h-10 bg-gray-200 rounded p-1">
                      <div className="w-full h-full bg-white rounded"></div>
                   </div>
                   <span className="font-medium">No Sidebar (Full Width)</span>
                </div>
             </div>
          </div>
       </div>
    </AdminLayout>
  );
};

export const PluginManager: React.FC = () => {
  const [plugins, setPlugins] = useState(store.getPlugins());

  const toggle = (id: string) => {
    store.togglePlugin(id);
    setPlugins([...store.getPlugins()]);
  };

  return (
    <AdminLayout>
       <h1 className="text-2xl font-bold text-gray-900 mb-6">Plugin Manager</h1>
       <div className="space-y-4">
         {plugins.map(p => (
           <div key={p.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                 <div className="flex items-center gap-3">
                   <h3 className="font-bold text-gray-900">{p.name}</h3>
                   <span className="text-xs bg-gray-100 text-gray-500 px-2 rounded">v{p.version}</span>
                 </div>
                 <p className="text-gray-500 text-sm mt-1">{p.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={p.active} onChange={() => toggle(p.id)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
           </div>
         ))}
       </div>
    </AdminLayout>
  );
};