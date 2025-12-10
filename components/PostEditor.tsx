import React, { useState, useEffect } from 'react';
import { Post, PostStatus, ContentType } from '../types';
import { store } from '../services/mockStore';
import { generateBlogDraft, suggestTitles } from '../services/geminiService';
import { Save, Image as ImageIcon, Sparkles, Layout, Eye, ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PostEditorProps {
  postId?: string;
  postType?: ContentType;
}

export const PostEditor: React.FC<PostEditorProps> = ({ postId, postType = 'post' }) => {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  const [isAiLoading, setAiLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT);
  const [type, setType] = useState<ContentType>(postType);
  const [featuredImage, setFeaturedImage] = useState('');

  useEffect(() => {
    if (postId) {
      const post = store.getPostById(postId);
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setTags(post.tags.join(', '));
        setStatus(post.status);
        setType(post.type);
        setFeaturedImage(post.featured_image_url || '');
      }
    } else {
      setType(postType);
    }
  }, [postId, postType]);

  const handleSlugChange = (val: string) => {
     setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleSave = () => {
    if (!user) return;
    
    const newPost: Post = {
      id: postId || crypto.randomUUID(),
      author_id: user.id,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content,
      excerpt,
      status,
      type,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      featured_image_url: featuredImage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: status === PostStatus.PUBLISHED ? new Date().toISOString() : undefined
    };

    store.savePost(newPost);
    navigate(type === 'post' ? '/admin' : '/admin/pages');
  };

  const handleAiGenerate = async () => {
    const topic = prompt(`What should this ${type} be about?`);
    if (!topic) return;

    setAiLoading(true);
    try {
      const draft = await generateBlogDraft(topic);
      setContent(draft);
      if (!title) {
        const suggested = await suggestTitles(draft);
        if (suggested.length > 0) setTitle(suggested[0]);
      }
    } catch (e) {
      alert("AI Generation failed. Check API Key configuration.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Editor Toolbar */}
      <div className="bg-white border border-gray-200 rounded-t-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(type === 'post' ? '/admin' : '/admin/pages')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <input
            type="text"
            placeholder={`${type === 'post' ? 'Post' : 'Page'} Title`}
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!postId && !slug) handleSlugChange(e.target.value); }}
            className="text-xl font-bold border-none outline-none focus:ring-0 w-64 md:w-96 placeholder-gray-300"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAiGenerate}
            disabled={isAiLoading}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors ${isAiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Sparkles size={16} />
            {isAiLoading ? 'Thinking...' : 'AI Writer'}
          </button>

          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {previewMode ? <Layout size={16} /> : <Eye size={16} />}
            {previewMode ? 'Edit' : 'Preview'}
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)}
             className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Settings size={20} />
          </button>
          
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={PostStatus.DRAFT}>Draft</option>
            <option value={PostStatus.PUBLISHED}>Publish</option>
          </select>

          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white border-x border-b border-gray-200 rounded-b-xl relative">
        {/* Settings Sidebar (Overlay) */}
        {showSettings && (
           <div className="w-80 border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto absolute left-0 h-full z-10 shadow-lg">
              <h3 className="font-semibold text-gray-700 mb-4">{type === 'post' ? 'Post' : 'Page'} Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">URL Slug</label>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Excerpt (SEO Description)</label>
                  <textarea 
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {type === 'post' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Tech, Life, Code"
                      className="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Featured Image URL</label>
                  <div className="flex gap-2">
                     <input 
                      type="text" 
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-600">
                      <ImageIcon size={16} />
                    </button>
                  </div>
                  {featuredImage && (
                    <img src={featuredImage} alt="Featured" className="mt-2 rounded-md h-32 w-full object-cover" />
                  )}
                </div>
              </div>
           </div>
        )}

        {/* Main Editor Area */}
        {previewMode ? (
          <div className="flex-1 p-8 overflow-y-auto prose prose-indigo max-w-none prose-content">
             <h1>{title}</h1>
             {featuredImage && <img src={featuredImage} alt="Cover" className="rounded-xl w-full max-h-96 object-cover mb-8" />}
             <div className="whitespace-pre-wrap">{content}</div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Start writing your ${type} in Markdown...`}
            className={`flex-1 p-8 resize-none outline-none font-mono text-sm leading-relaxed text-gray-800 ${showSettings ? 'ml-80' : ''} transition-all duration-300`}
          />
        )}
      </div>
    </div>
  );
};