
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  category: 'swe' | 'data-science' | 'strategy';
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Essay {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
}

export enum NavigationTab {
  HOME = 'home',
  SWE = 'swe',
  DS = 'data-science',
  STRATEGY = 'strategy'
}
