export enum Role {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  AUTHOR = 'AUTHOR',
  USER = 'USER'
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export type ContentType = 'post' | 'page';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  type: 'image' | 'video' | 'document';
  uploaded_at: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  active: boolean;
  version: string;
}

export interface ThemeConfig {
  activeTheme: string;
  layout: 'sidebar-left' | 'sidebar-right' | 'no-sidebar';
  showRssFeed: boolean;
}

export interface SiteSettings {
  general: {
    title: string;
    description: string;
    language: string;
  };
  seo: {
    searchEngineVisible: boolean;
    metaKeywords: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  smtp: {
    host: string;
    port: string;
    user: string;
    enabled: boolean;
  };
  ads: {
    headerSlot: string;
    sidebarSlot: string;
    footerSlot: string;
  };
  agc: {
    rssSourceUrl: string;
    enabled: boolean;
  };
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string; // Markdown
  excerpt?: string;
  status: PostStatus;
  type: ContentType;
  published_at?: string;
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  reading_time?: number; // minutes
  tags: string[];
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}