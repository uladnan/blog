import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { AdminLayout } from '../components/Layout';
import { PostStatus, ContentType, Post } from '../types';
import { Edit2, Trash2, Plus, FileText, CheckCircle, TrendingUp, Users, Image as ImageIcon, MessageSquare } from 'lucide-react';

interface ContentListProps {
  type: ContentType;
  title: string;
}

const ContentList: React.FC<ContentListProps> = ({ type, title }) => {
  const [items, setItems] = React.useState<Post[]>(store.getPosts(undefined, type));
  const navigate = useNavigate();

  React.useEffect(() => {
    setItems(store.getPosts(undefined, type));
  }, [type]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      store.deletePost(id);
      setItems([...store.getPosts(undefined, type)]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
           <p className="text-sm text-gray-500">Manage your {title.toLowerCase()} content.</p>
        </div>
        <Link 
          to={`/admin/${type === 'post' ? 'posts' : 'pages'}/new`}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Create {type === 'post' ? 'Post' : 'Page'}
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 font-medium text-gray-900 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No {type}s found. Start creating!
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1">/{item.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === PostStatus.PUBLISHED 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status === PostStatus.PUBLISHED ? <CheckCircle size={12} /> : <FileText size={12} />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                       {item.category_id ? 'Tech' : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/${type === 'post' ? 'posts' : 'pages'}/${item.id}`)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const stats = store.getStats();

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
       <div>
         <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
         <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
       </div>
       <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
         <Icon size={24} className="text-white" />
       </div>
    </div>
  );

  return (
    <AdminLayout>
       <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Posts" value={stats.posts} icon={FileText} color="bg-blue-500" />
          <StatCard label="Static Pages" value={stats.pages} icon={CheckCircle} color="bg-green-500" />
          <StatCard label="Registered Users" value={stats.users} icon={Users} color="bg-purple-500" />
          <StatCard label="Media Files" value={stats.media} icon={ImageIcon} color="bg-orange-500" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Recent Activity</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Real-time</span>
             </div>
             <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-800 font-medium">New post "Getting Started with CMS" published.</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago by Admin</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-6">Quick Actions</h3>
             <div className="space-y-3">
                <Link to="/admin/posts/new" className="block w-full text-center py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors">
                   Write New Post
                </Link>
                <Link to="/admin/settings" className="block w-full text-center py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                   System Settings
                </Link>
             </div>
          </div>
       </div>
    </AdminLayout>
  );
};

export const AdminPosts: React.FC = () => <AdminLayout><ContentList type="post" title="All Posts" /></AdminLayout>;
export const AdminPages: React.FC = () => <AdminLayout><ContentList type="page" title="Static Pages" /></AdminLayout>;