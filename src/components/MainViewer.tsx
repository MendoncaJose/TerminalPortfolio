import { useEffect, useMemo, useState } from 'react';
import { Activity, Code, Database, Monitor } from 'lucide-react';
import profileImage from '../public/profile.png';
import type { Project, Section } from '../types';
import { ContactPanel } from './ContactPanel';
import { Panel } from './Panel';
import { ProjectCard } from './ProjectCard';
import { SkillMatrix } from './SkillMatrix';
import { VimEditorModal } from './VimEditorModal';
import { DitherShader } from './ui/DitherShader';

type MainViewerProps = {
  active: Section;
  projects: Project[];
  vimEditingProject: Project | null;
  onSaveProject: (project: Project) => void;
  onCancelVim: () => void;
};

export function MainViewer({ active, projects, vimEditingProject, onSaveProject, onCancelVim }: MainViewerProps) {
  const [projectPage, setProjectPage] = useState(0);
  const projectsPerPage = 3;
  const totalProjectPages = Math.max(1, Math.ceil(projects.length / projectsPerPage));
  const visibleProjects = useMemo(
    () => projects.slice(projectPage * projectsPerPage, projectPage * projectsPerPage + projectsPerPage),
    [projectPage, projects]
  );

  useEffect(() => {
    setProjectPage((current) => Math.min(current, totalProjectPages - 1));
  }, [totalProjectPages]);

  return (
    <Panel title={`VIEWER: ${active.toUpperCase()}`} className="main-panel">
      {active === 'home' && (
        <div className="view-stack">
          <div className="message-box">
            <span>WELCOME_MESSAGE</span>
            <p>
              GREETINGS, TRAVELER. Welcome to José Mendonça's digital terminal. This system contains frontend experiments, production projects and
              developer profile data.
            </p>
          </div>

          <div className="capability-grid">
            <div>
              <span>
                <Code size={26} />
              </span>
              <small>FRONTEND_DEV</small>
              <strong>Expert</strong>
            </div>
            <div>
              <span>
                <Database size={26} />
              </span>
              <small>BACKEND_API</small>
              <strong>Intermediate / Advanced</strong>
            </div>
            <div>
              <span>
                <Monitor size={26} />
              </span>
              <small>UI_SYSTEMS</small>
              <strong>Advanced</strong>
            </div>
            <div>
              <span>
                <Activity size={26} />
              </span>
              <small>MACHINE_LEARNING</small>
              <strong>Loading...</strong>
            </div>
          </div>
          <div className="activity-log">
            <h2>RECENT_ACTIVITY_LOG</h2>
            <div className="activity-row">
              <time>[2026-06-06]</time>
              <span>Built interactive React portfolio</span>
              <strong data-status="success">[SUCCESS]</strong>
            </div>
            <div className="activity-row">
              <time>[2026-06-05]</time>
              <span>Developed scalable frontend interfaces</span>
              <strong data-status="success">[SUCCESS]</strong>
            </div>
            <div className="activity-row">
              <time>[2026-06-04]</time>
              <span>Integrated APIs and authentication flows</span>
              <strong data-status="pending">[PENDING]</strong>
            </div>
            <div className="activity-row">
              <time>[2026-06-03]</time>
              <span>Exploring terminal-based UX systems</span>
              <strong data-status="blocked">[BLOCKED]</strong>
            </div>
          </div>
        </div>
      )}

      {active === 'profile' && (
        <div className="profile-view">
          <div className="avatar-frame" aria-hidden="true">
            <DitherShader
              src={profileImage}
              gridSize={1}
              ditherMode="noise"
              colorMode="duotone"
              primaryColor="#020602"
              secondaryColor="#33ff00"
              backgroundColor="#020602"
              contrast={1.18}
              brightness={-0.02}
              threshold={0.46}
              objectFit="contain"
              className="profile-dither"
              animated
              pixelRatio={1}
            />
          </div>
          <div className="profile-data">
            <h1>USER_PROFILE_DATA</h1>
            <p>
              Software Engineer with frontend focus, experienced in React, TypeScript, JavaScript and modern interface architecture. I build digital
              experiences that combine usability, performance and visual identity.
            </p>
            <dl>
              <div>
                <dt>Location:</dt>
                <dd>Portugal / Remote</dd>
              </div>
              <div>
                <dt>Role:</dt>
                <dd>Frontend / Software Engineer</dd>
              </div>
              <div>
                <dt>Level:</dt>
                <dd>Mid-level Developer</dd>
              </div>
              <div>
                <dt>Status:</dt>
                <dd>ONLINE</dd>
              </div>
            </dl>
          </div>
          <SkillMatrix />
        </div>
      )}

      {active === 'projects' && (
        <div className={`projects-view ${projects.length > projectsPerPage ? 'has-pagination' : ''}`}>
          <div className="projects-page">
            {visibleProjects.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </div>
          {projects.length > projectsPerPage && (
            <div className="project-pagination">
              <button type="button" onClick={() => setProjectPage((page) => Math.max(0, page - 1))} disabled={projectPage === 0}>
                [ PREV ]
              </button>
              <span>
                PAGE {String(projectPage + 1).padStart(2, '0')} / {String(totalProjectPages).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setProjectPage((page) => Math.min(totalProjectPages - 1, page + 1))}
                disabled={projectPage >= totalProjectPages - 1}
              >
                [ NEXT ]
              </button>
            </div>
          )}
        </div>
      )}

      {active === 'contact' && <ContactPanel />}
      {vimEditingProject && <VimEditorModal project={vimEditingProject} onSave={onSaveProject} onCancel={onCancelVim} />}
    </Panel>
  );
}
