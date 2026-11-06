/**
 * Core types for vadirn.io
 */

export type ProjectCategory = 'all' | 'ai-agents' | 'creative-shaders' | 'systems' | 'micro-tools';

export interface GitHubStats {
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: 'ai-agents' | 'creative-shaders' | 'systems' | 'micro-tools';
  categoryLabel: string;
  experimentType: 'AI' | 'Web Dev' | 'Systems' | 'Tooling';
  language: string;
  runtime: string;
  tech: string[];
  metrics: string;
  githubUrl: string;
  demoUrl?: string;
  hasInteractiveDemo: boolean;
  demoType?: 'latency-bench' | 'vector-flow' | 'agent-tree' | 'token-math';
  image?: string;
  githubStats: GitHubStats;
  invariants: string[];
  architectureSummary: string;
  installCommand?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[];
  tableOfContents: { id: string; title: string }[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  timestamp: string;
}
