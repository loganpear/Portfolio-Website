
import { Project, Experience, Essay } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Distributed Compute Engine',
    description: 'A high-performance task scheduler built with Rust and gRPC.',
    tags: ['Rust', 'Distributed Systems', 'gRPC'],
    category: 'swe',
    link: 'https://github.com'
  },
  {
    id: '2',
    title: 'Customer Churn Predictor',
    description: 'XGBoost model identifying at-risk users with 94% AUC.',
    tags: ['Python', 'Scikit-Learn', 'Pandas'],
    category: 'data-science'
  },
  {
    id: '3',
    title: 'Neobank Expansion Strategy',
    description: 'GTM analysis for entering the LATAM market focusing on unbanked populations.',
    tags: ['Product Strategy', 'Market Analysis'],
    category: 'strategy'
  }
];

export const MOCK_EXPERIENCE: Experience[] = [
  {
    role: 'Software Engineer Intern',
    company: 'TechCorp Global',
    period: 'Summer 2024',
    description: 'Optimized query latency by 40% using Redis caching layers.'
  },
  {
    role: 'Data Science Researcher',
    company: 'University Lab',
    period: '2023 - Present',
    description: 'Developing NLP models for sentiment analysis on financial news.'
  }
];

export const MOCK_ESSAYS: Essay[] = [
  {
    id: 'essay-1',
    title: 'The Intersection of ML and Product Design',
    excerpt: 'Why raw accuracy isn\'t the most important metric for user experience.',
    date: 'Oct 2024',
    content: 'Full essay content here...'
  },
  {
    id: 'essay-2',
    title: 'Rethinking Subscription Models',
    excerpt: 'A deep dive into usage-based pricing in SaaS.',
    date: 'Nov 2024',
    content: 'Full essay content here...'
  }
];
