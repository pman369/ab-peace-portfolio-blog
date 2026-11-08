import { BlogPost } from '../types';
import { BLOG_POSTS as INITIAL_POSTS } from '../data/posts';

const STORAGE_KEY = 'abpeace_custom_articles';
const DRAFT_KEY = 'abpeace_active_draft';

export interface DraftArticle {
  title: string;
  excerpt: string;
  readTime: string;
  tags: string;
  content: string;
  lastUpdated: string;
}

export function getCustomArticles(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getAllArticles(): BlogPost[] {
  const custom = getCustomArticles();
  return [...custom, ...INITIAL_POSTS];
}

export function saveCustomArticle(article: Omit<BlogPost, 'id' | 'isUserCreated'>): BlogPost {
  const custom = getCustomArticles();
  const newArticle: BlogPost = {
    ...article,
    id: 'user_art_' + Date.now(),
    isUserCreated: true,
    author: 'AB Peace',
  };
  const updated = [newArticle, ...custom];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // quota exceeded or private mode
  }
  return newArticle;
}

export function deleteCustomArticle(id: string): BlogPost[] {
  const custom = getCustomArticles();
  const updated = custom.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // silent fail
  }
  return [...updated, ...INITIAL_POSTS];
}

export function loadSavedDraft(): DraftArticle | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: DraftArticle): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // silent fail
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // silent fail
  }
}

export function exportBackupJson(): void {
  const all = getAllArticles();
  const payload = {
    exportDate: new Date().toISOString(),
    version: '2026.1',
    author: 'AB Peace',
    articles: all,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `abpeace-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackupJson(file: File): Promise<number> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed.articles || !Array.isArray(parsed.articles)) {
    throw new Error('Invalid backup file structure.');
  }

  const userItems = parsed.articles.filter((p: BlogPost) => p.isUserCreated);
  const current = getCustomArticles();
  const mergedMap = new Map<string, BlogPost>();

  current.forEach((item) => mergedMap.set(item.slug || item.id, item));
  userItems.forEach((item: BlogPost) => mergedMap.set(item.slug || item.id, item));

  const result = Array.from(mergedMap.values());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  return userItems.length;
}

export function exportArticleAsMarkdown(article: BlogPost): void {
  const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
date: "${article.date}"
readTime: "${article.readTime}"
tags: [${article.tags.map((t) => `"${t}"`).join(', ')}]
author: "${article.author || 'AB Peace'}"
excerpt: "${article.excerpt.replace(/"/g, '\\"')}"
---

# ${article.title}

`;
  const body = Array.isArray(article.content) ? article.content.join('\n\n') : article.content;
  const fullText = frontmatter + body;

  const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${article.slug || 'abpeace-article'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
