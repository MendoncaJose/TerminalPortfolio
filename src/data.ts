import type { IconType } from 'react-icons';
import { FaAngular, FaCss3Alt, FaGitAlt, FaNodeJs, FaReact } from 'react-icons/fa';
import { SiJavascript, SiMongodb, SiMui, SiPrimereact, SiTailwindcss, SiTypescript } from 'react-icons/si';
import { Folder, Home, Mail, User, type LucideIcon } from 'lucide-react';
import type { Project, Section } from './types';
import zustandIcon from './public/zustand.svg';

type SkillItem = {
  label: string;
  icon?: IconType;
  imageSrc?: string;
};

export const bootLines = [
  'BIOS CHECK ............................ [ OK ]',
  'LOADING KERNEL ........................ [ OK ]',
  'MOUNTING PORTFOLIO_FS ................. [ OK ]',
  'INITIALIZING MATRIX INTRO ............. [ OK ]',
  'SYNCING COMPONENT REGISTRY ............ [ OK ]',
  'STARTING DASHBOARD SHELL .............. [ OK ]',
  'SECURE CONNECTION ESTABLISHED ......... [ OK ]',
];

export const skillItems: SkillItem[] = [
  { label: 'React', icon: FaReact },
  { label: 'TypeScript', icon: SiTypescript },
  { label: 'JavaScript', icon: SiJavascript },
  { label: 'Angular', icon: FaAngular },
  { label: 'Node.js', icon: FaNodeJs },
  { label: 'CSS', icon: FaCss3Alt },
  { label: 'Tailwind', icon: SiTailwindcss },
  { label: 'MUI', icon: SiMui },
  { label: 'Git', icon: FaGitAlt },
  { label: 'MongoDB', icon: SiMongodb },
  { label: 'Zustand', imageSrc: zustandIcon },
  { label: 'PrimeReact', icon: SiPrimereact },
];

export const initialProjects: Project[] = [
  {
    id: 'project_galaxy',
    title: 'PROJECT_GALAXY',
    description: 'Interactive frontend experiment with animated UI states and polished dashboard flows.',
    tags: ['React', 'TypeScript', 'UI'],
    status: 'LIVE',
    liveDemoUrl: '#',
  },
  {
    id: 'smartex_catalog',
    title: 'SMARTEX_CATALOG',
    description: 'Scalable catalog interface with API integration, auth flows and operational screens.',
    tags: ['Angular', 'Node.js', 'MUI'],
    status: 'CASE_STUDY',
    liveDemoUrl: '#',
  },
  {
    id: 'cyango_editor',
    title: 'CYANGO_EDITOR',
    description: 'Editor-style interface concept focused on fast content manipulation and clean UX.',
    tags: ['React', 'Zustand', 'CSS'],
    status: 'DEV',
    liveDemoUrl: '#',
  },
];

export const navItems: Array<{ id: Section; label: string; icon: LucideIcon }> = [
  { id: 'home', label: 'HOME_DASHBOARD', icon: Home },
  { id: 'profile', label: 'PROFILE_DATA', icon: User },
  { id: 'projects', label: 'PROJECT_INDEX', icon: Folder },
  { id: 'contact', label: 'COMM_LINK', icon: Mail },
];
