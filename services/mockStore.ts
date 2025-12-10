import { Post, User, Role, PostStatus, ContentType, Category, MediaItem, SiteSettings, Plugin, ThemeConfig } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@lumina.com', role: Role.ADMIN, avatar_url: 'https://picsum.photos/id/64/100/100', created_at: new Date().toISOString() },
  { id: 'u2', name: 'Jane Moderator', email: 'mod@lumina.com', role: Role.MODERATOR, avatar_url: 'https://picsum.photos/id/65/100/100', created_at: new Date().toISOString() },
  { id: 'u3', name: 'John Doe', email: 'john@gmail.com', role: Role.USER, avatar_url: 'https://picsum.photos/id/66/100/100', created_at: new Date().toISOString() },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Technology', slug: 'tech', count: 5 },
  { id: 'c2', name: 'Lifestyle', slug: 'lifestyle', count: 3 },
  { id: 'c3', name: 'Tutorials', slug: 'tutorials', count: 8 },
];

const INITIAL_MEDIA: MediaItem[] = [
  { id: 'm1', url: 'https://picsum.photos/id/20/800/400', filename: 'laptop-work.jpg', type: 'image', uploaded_at: new Date().toISOString() },
  { id: 'm2', url: 'https://picsum.photos/id/2/800/400', filename: 'writing-notebook.jpg', type: 'image', uploaded_at: new Date().toISOString() },
  { id: 'm3', url: 'https://picsum.photos/id/3/800/400', filename: 'coding-setup.jpg', type: 'image', uploaded_at: new Date().toISOString() },
];

const INITIAL_PLUGINS: Plugin[] = [
  { id: 'pl1', name: 'SEO Booster Pro', description: 'Automatically generates meta tags and sitemaps.', active: true, version: '1.2.0' },
  { id: 'pl2', name: 'AGC RSS Importer', description: 'Auto-generate content from RSS feeds.', active: false, version: '0.9.beta' },
  { id: 'pl3', name: 'Super Cache', description: 'Speed up your site by caching static pages.', active: true, version: '2.0.1' },
];

const INITIAL_SETTINGS: SiteSettings = {
  general: { title: 'Lumina CMS', description: 'A modern blogging platform', language: 'en' },
  seo: { searchEngineVisible: true, metaKeywords: 'blog, cms, react' },
  social: { facebook: 'https://facebook.com', twitter: '@lumina', instagram: '' },
  smtp: { host: 'smtp.gmail.com', port: '587', user: 'noreply@lumina.com', enabled: false },
  ads: { headerSlot: '', sidebarSlot: '', footerSlot: '' },
  agc: { rssSourceUrl: '', enabled: false }
};

const INITIAL_THEME: ThemeConfig = {
  activeTheme: 'default-light',
  layout: 'sidebar-right',
  showRssFeed: true
};

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    author_id: 'u1',
    title: 'Welcome to Lumina CMS',
    slug: 'welcome-to-lumina',
    content: `# Welcome to the Future of Blogging\n\nLumina is a minimalist CMS designed for speed.`,
    excerpt: 'An introduction to the new Lumina Content Management System.',
    status: PostStatus.PUBLISHED,
    type: 'post',
    published_at: new Date().toISOString(),
    featured_image_url: 'https://picsum.photos/id/20/800/400',
    tags: ['Announcement', 'Tech'],
    category_id: 'c1',
    reading_time: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'page1',
    author_id: 'u1',
    title: 'About Us',
    slug: 'about',
    content: `# About Lumina\n\nWe are a team of passionate developers.`,
    excerpt: 'Learn more about the team behind Lumina.',
    status: PostStatus.PUBLISHED,
    type: 'page',
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

class Store {
  private posts: Post[] = INITIAL_POSTS;
  private users: User[] = MOCK_USERS;
  private categories: Category[] = INITIAL_CATEGORIES;
  private media: MediaItem[] = INITIAL_MEDIA;
  private plugins: Plugin[] = INITIAL_PLUGINS;
  private settings: SiteSettings = INITIAL_SETTINGS;
  private theme: ThemeConfig = INITIAL_THEME;
  private currentUser: User | null = null;

  // --- Auth ---
  login(email: string): User {
    const found = this.users.find(u => u.email === email) || MOCK_USERS[0];
    this.currentUser = found;
    localStorage.setItem('lumina_user', JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('lumina_user');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    const stored = localStorage.getItem('lumina_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return null;
  }

  // --- Posts ---
  getPosts(status?: PostStatus, type: ContentType = 'post'): Post[] {
    let filtered = this.posts.filter(p => p.type === type);
    if (status) filtered = filtered.filter(p => p.status === status);
    return filtered;
  }
  getPostBySlug(slug: string): Post | undefined { return this.posts.find(p => p.slug === slug); }
  getPostById(id: string): Post | undefined { return this.posts.find(p => p.id === id); }
  savePost(post: Post): Post {
    const index = this.posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      this.posts[index] = { ...post, updated_at: new Date().toISOString() };
      return this.posts[index];
    } else {
      const newPost = { ...post, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      this.posts = [newPost, ...this.posts];
      return newPost;
    }
  }
  deletePost(id: string) { this.posts = this.posts.filter(p => p.id !== id); }

  // --- Users ---
  getUsers() { return this.users; }
  saveUser(user: User) {
     const idx = this.users.findIndex(u => u.id === user.id);
     if (idx >= 0) this.users[idx] = user;
     else this.users.push(user);
  }
  deleteUser(id: string) { this.users = this.users.filter(u => u.id !== id); }

  // --- Categories ---
  getCategories() { return this.categories; }
  saveCategory(cat: Category) {
    const idx = this.categories.findIndex(c => c.id === cat.id);
    if (idx >= 0) this.categories[idx] = cat;
    else this.categories.push(cat);
  }
  deleteCategory(id: string) { this.categories = this.categories.filter(c => c.id !== id); }

  // --- Media ---
  getMedia() { return this.media; }
  addMedia(item: MediaItem) { this.media = [item, ...this.media]; }
  
  // --- Settings & Config ---
  getSettings() { return this.settings; }
  saveSettings(s: SiteSettings) { this.settings = s; }
  
  getPlugins() { return this.plugins; }
  togglePlugin(id: string) {
    const p = this.plugins.find(x => x.id === id);
    if (p) p.active = !p.active;
  }

  getThemeConfig() { return this.theme; }
  saveThemeConfig(t: ThemeConfig) { this.theme = t; }

  // --- Stats ---
  getStats() {
    return {
      posts: this.posts.filter(p => p.type === 'post').length,
      pages: this.posts.filter(p => p.type === 'page').length,
      users: this.users.length,
      media: this.media.length
    };
  }
}

export const store = new Store();