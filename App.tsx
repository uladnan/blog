import React from 'react';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { HomePage, PostPage, PageViewer } from './pages/Public';
import { AdminDashboard, AdminPosts, AdminPages } from './pages/Admin';
import { MediaManager, UserManager, SettingsManager, CategoryManager, ThemeManager, PluginManager } from './pages/AdminTools';
import { PostEditor } from './components/PostEditor';
import { LoginPage } from './pages/Login';
import { AdminLayout } from './components/Layout';
import { store } from './services/mockStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = store.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/p/:slug" element={<PostPage />} />
        <Route path="/:slug" element={<PageViewer />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        {/* Content Management */}
        <Route path="/admin/posts" element={<ProtectedRoute><AdminPosts /></ProtectedRoute>} />
        <Route path="/admin/pages" element={<ProtectedRoute><AdminPages /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><CategoryManager /></ProtectedRoute>} />
        <Route path="/admin/media" element={<ProtectedRoute><MediaManager /></ProtectedRoute>} />

        {/* User Management */}
        <Route path="/admin/users" element={<ProtectedRoute><UserManager /></ProtectedRoute>} />
        <Route path="/admin/comments" element={<ProtectedRoute><AdminLayout><div>Coming Soon</div></AdminLayout></ProtectedRoute>} />

        {/* System & Config */}
        <Route path="/admin/settings" element={<ProtectedRoute><SettingsManager /></ProtectedRoute>} />
        <Route path="/admin/themes" element={<ProtectedRoute><ThemeManager /></ProtectedRoute>} />
        <Route path="/admin/plugins" element={<ProtectedRoute><PluginManager /></ProtectedRoute>} />
        
        {/* Editors */}
        <Route path="/admin/posts/new" element={<ProtectedRoute><AdminLayout><PostEditor postType="post" /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/posts/:id" element={<ProtectedRoute><AdminLayout><PostEditorWrapper /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/pages/new" element={<ProtectedRoute><AdminLayout><PostEditor postType="page" /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/pages/:id" element={<ProtectedRoute><AdminLayout><PostEditorWrapper /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
};

// Wrapper to extract ID params for the editor
const PostEditorWrapper = () => {
  const { id } = useParams();
  return <PostEditor postId={id} />;
};

export default App;