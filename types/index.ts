export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  email: string;
  phone: string;
  phone_il?: string;
  location: string;
  linkedin: string;
  headshot: string;
  bio: string;
  about: string;
}

export interface Sample {
  src: string;
  caption?: string;
  poster?: string;
}

export interface Project {
  id: string;
  title: string;
  type: 'ui' | 'flow' | 'system' | 'doc' | 'video';
  summary: string;
  context?: string;
  decisions?: string[];
  impact?: string[];
  samples: Sample[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  logo: string | null;
  logoText?: string;
  color: string;
  summary: string;
  expanded: string;
  note?: string;
  wins: string[];
  owned: string[];
  tools: string[];
  projects: Project[];
}
