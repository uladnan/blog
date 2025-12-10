import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../components/Layout';
import { store } from '../services/mockStore';
import { Post, PostStatus } from '../types';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const published = store.getPosts(PostStatus.PUBLISHED, 'post');
    setPosts(published);
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">The Lumina Blog</h1>
          <p className="text-xl text-gray-500">Thoughts, stories, and ideas.</p>
        </div>

        <div className="grid gap-12">
          {posts.map(post => (
            <article key={post.id} className="group flex flex-col md:flex-row gap-8 items-start">
              {post.featured_image_url && (
                <Link to={`/p/${post.slug}`} className="w-full md:w-1/3 aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {post.reading_time || 5} min read</span>
                </div>
                <Link to={`/p/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors font-serif">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt || post.content.substring(0, 150) + '...'}
                </p>
                <div className="flex items-center gap-2">
                   {post.tags.map(tag => (
                     <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase tracking-wide font-semibold">{tag}</span>
                   ))}
                </div>
              </div>
            </article>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500">No published posts yet.</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export const PostPage: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (slug) {
      const found = store.getPostBySlug(slug);
      if (found && found.type === 'post') setPost(found);
    }
  }, [slug]);

  if (!post) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
          <Link to="/" className="text-indigo-600 mt-4 inline-block hover:underline">Return Home</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                 <img src="https://picsum.photos/id/64/100/100" alt="Author" />
               </div>
               <span>Admin User</span>
             </div>
             <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </header>

        {post.featured_image_url && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-sm">
             <img src={post.featured_image_url} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        <div className="prose prose-lg prose-indigo max-w-none prose-content text-gray-800 leading-8">
           <div className="whitespace-pre-wrap">{post.content}</div>
        </div>

        <hr className="my-12 border-gray-200" />
        
        <div className="flex justify-between items-center">
           <Link to="/" className="flex items-center gap-2 text-indigo-600 font-medium hover:underline">
             &larr; Back to Articles
           </Link>
        </div>
      </article>
    </PublicLayout>
  );
};

export const PageViewer: React.FC = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<Post | null>(null);

  useEffect(() => {
    if (slug) {
      const found = store.getPostBySlug(slug);
      if (found && found.type === 'page') setPage(found);
    }
  }, [slug]);

  if (!page) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
          <Link to="/" className="text-indigo-600 mt-4 inline-block hover:underline">Return Home</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
            {page.title}
          </h1>
        </header>

        {page.featured_image_url && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-sm">
             <img src={page.featured_image_url} alt={page.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        <div className="prose prose-lg prose-indigo max-w-none prose-content text-gray-800 leading-8">
           <div className="whitespace-pre-wrap">{page.content}</div>
        </div>
      </article>
    </PublicLayout>
  );
};