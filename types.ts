export interface Experience {
  id: string;
  title: string;
  role?: string;
  institution: string;
  date: string;
  description: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  category: 'Research' | 'Innovation' | 'Competition';
  description: string;
  techStack: string[];
  image?: string;
  link?: string;
}

export interface NavItem {
  label: string;
  href: string;
}