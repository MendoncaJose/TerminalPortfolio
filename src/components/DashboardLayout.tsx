import { useState } from 'react';
import { initialProjects } from '../data';
import type { Directory, Project, Section } from '../types';
import { directoryPrompt, displayTitle, formatProjectTitle, sectionFromDirectory } from '../utils/terminal';
import { HeaderStatusBar } from './HeaderStatusBar';
import { MainViewer } from './MainViewer';
import { SidebarNavigation } from './SidebarNavigation';
import { StatusFooter } from './StatusFooter';
import { TerminalShell } from './TerminalShell';

export function DashboardLayout() {
  const [active, setActive] = useState<Section>('home');
  const [currentDirectory, setCurrentDirectory] = useState<Directory>('~');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [vimEditingProject, setVimEditingProject] = useState<Project | null>(null);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'guest@system:~$ init',
    'Initializing System Interface v2.4...',
    'guest@system:~$ whoami',
    'José Mendonça',
    'guest@system:~$ uptime',
    'System active. All modules operational.',
  ]);

  const appendTerminal = (lines: string[]) => setTerminalHistory((current) => [...current, ...lines]);

  const changeView = (section: Section) => {
    setActive(section);
    const directoryBySection: Record<Section, Directory> = {
      home: '~/dashboard',
      profile: '~/dashboard/profile_data',
      projects: '~/dashboard/project_index',
      contact: '~/dashboard/comm_link',
    };
    setCurrentDirectory(directoryBySection[section]);
  };

  const listDirectory = (directory: Directory) => {
    if (directory === '~') return ['dashboard'];
    if (directory === '~/dashboard') return ['profile_data', 'project_index', 'comm_link'];
    if (directory === '~/dashboard/project_index') return projects.map((project) => project.id);
    if (directory.startsWith('~/dashboard/project_index/')) return ['project.json', 'README.md', 'live_demo.url'];
    return [];
  };

  const treeLines = () => [
    '.',
    '`-- dashboard',
    '    |-- profile_data',
    '    |-- project_index',
    ...projects.map((project, index) => `    |   ${index === projects.length - 1 ? '`--' : '|--'} ${project.id}`),
    '    `-- comm_link',
  ];

  const executeCommand = (rawCommand: string) => {
    if (rawCommand.startsWith('__log ')) {
      appendTerminal([`guest@system:~$ ${rawCommand.replace('__log ', '')}`]);
      return;
    }

    const [command, ...args] = rawCommand.split(/\s+/);
    const target = args.join(' ');
    const promptLine = `${directoryPrompt(currentDirectory)} ${rawCommand}`;

    if (command === 'help') {
      appendTerminal([promptLine, 'help ls cd tree mkdir rmdir vim clear whoami uptime projects contact']);
      return;
    }

    if (command === 'clear') {
      setTerminalHistory([]);
      return;
    }

    if (command === 'whoami') {
      appendTerminal([promptLine, 'José Mendonça // Frontend / Software Engineer']);
      return;
    }

    if (command === 'uptime') {
      appendTerminal([promptLine, 'System active. All modules operational.']);
      return;
    }

    if (command === 'ls') {
      appendTerminal([promptLine, ...listDirectory(currentDirectory)]);
      return;
    }

    if (command === 'tree') {
      appendTerminal([promptLine, ...treeLines()]);
      return;
    }

    if (command === 'projects') {
      setActive('projects');
      setCurrentDirectory('~/dashboard/project_index');
      appendTerminal([promptLine, '[OK] opening PROJECT_INDEX']);
      return;
    }

    if (command === 'contact') {
      setActive('contact');
      setCurrentDirectory('~/dashboard/comm_link');
      appendTerminal([promptLine, '[OK] opening COMM_LINK', 'Email: mendoncajose7@gmail.com', 'GitHub: @mendoncajose7']);
      return;
    }

    if (command === 'cd') {
      let nextDirectory: Directory | null = null;
      if (!target || target === '~') nextDirectory = '~';
      if (target === 'profile_data' && currentDirectory === '~') nextDirectory = '~/dashboard/profile_data';
      if (target === 'project_index' && currentDirectory === '~') nextDirectory = '~/dashboard/project_index';
      if (target === 'comm_link' && currentDirectory === '~') nextDirectory = '~/dashboard/comm_link';
      if (target === '..') {
        if (currentDirectory === '~') {
          appendTerminal([promptLine, '[INFO] already at root directory']);
          return;
        }
        if (currentDirectory.startsWith('~/dashboard/project_index/')) {
          nextDirectory = '~/dashboard/project_index';
        } else {
          nextDirectory = currentDirectory === '~/dashboard' ? '~' : '~/dashboard';
        }
      }
      if (target === 'dashboard' && currentDirectory === '~') nextDirectory = '~/dashboard';
      if (target === 'profile_data' && currentDirectory === '~/dashboard') nextDirectory = '~/dashboard/profile_data';
      if (target === 'project_index' && currentDirectory === '~/dashboard') nextDirectory = '~/dashboard/project_index';
      if (target === 'comm_link' && currentDirectory === '~/dashboard') nextDirectory = '~/dashboard/comm_link';
      const projectTarget = formatProjectTitle(target);
      const projectMatch = projects.find((project) => project.id === projectTarget);
      if (projectMatch && target) {
        const liveUrl = projectMatch.liveDemoUrl !== '#' ? projectMatch.liveDemoUrl : 'https://github.com/MendoncaJose';
        nextDirectory = `~/dashboard/project_index/${projectTarget}`;
        window.open(liveUrl, '_blank', 'noopener,noreferrer');
        appendTerminal([promptLine, `[OPEN] launching live demo link: ${liveUrl}`]);
      }

      if (!nextDirectory) {
        appendTerminal([promptLine, `[ERR] directory not found: ${target || ''}`]);
        return;
      }

      setCurrentDirectory(nextDirectory);
      setActive(sectionFromDirectory(nextDirectory));
      if (!projectMatch) appendTerminal([promptLine]);
      return;
    }

    if (command === 'mkdir') {
      const id = formatProjectTitle(target);
      if (!id) {
        appendTerminal([promptLine, '[ERR] mkdir requires a project name']);
        return;
      }
      if (projects.some((project) => project.id === id)) {
        appendTerminal([promptLine, `[ERR] project already exists: ${id}`]);
        return;
      }
      const newProject: Project = {
        id,
        title: displayTitle(id),
        description: 'New indexed project created from terminal.',
        tags: ['React', 'TypeScript'],
        status: 'DEV',
        liveDemoUrl: '#',
        custom: true,
      };
      setProjects((current) => [...current, newProject]);
      setActive('projects');
      setCurrentDirectory('~/dashboard/project_index');
      appendTerminal([promptLine, `[OK] project directory created and indexed: ${id}`]);
      return;
    }

    if (command === 'rmdir') {
      const id = formatProjectTitle(target);
      if (!projects.some((project) => project.id === id)) {
        appendTerminal([promptLine, `[ERR] project not found: ${id}`]);
        return;
      }
      setProjects((current) => current.filter((project) => project.id !== id));
      appendTerminal([promptLine, `[OK] project removed from index: ${id}`]);
      return;
    }

    if (command === 'vim') {
      const id = formatProjectTitle(target);
      const project = projects.find((item) => item.id === id);
      if (!project) {
        appendTerminal([promptLine, `[ERR] project file not found: ${id}`]);
        return;
      }
      setActive('projects');
      setCurrentDirectory('~/dashboard/project_index');
      setVimEditingProject(project);
      appendTerminal([promptLine, `[OPEN] VIM_EDITOR: ${id}`]);
      return;
    }

    appendTerminal([promptLine, `[ERR] command not found: ${command}`]);
  };

  const saveProject = (project: Project) => {
    setProjects((current) => current.map((item) => (item.id === project.id ? project : item)));
    setVimEditingProject(null);
    appendTerminal(['[WRITE] project file updated successfully']);
  };

  const cancelVim = () => {
    setVimEditingProject(null);
    appendTerminal(['[INFO] vim session closed without changes']);
  };

  return (
    <main className="dashboard">
      <HeaderStatusBar />

      <div className="dashboard-grid">
        <SidebarNavigation active={active} onChange={changeView} />
        <MainViewer active={active} projects={projects} vimEditingProject={vimEditingProject} onSaveProject={saveProject} onCancelVim={cancelVim} />
        <TerminalShell currentDirectory={currentDirectory} terminalHistory={terminalHistory} onCommand={executeCommand} />
      </div>

      <StatusFooter />
    </main>
  );
}
