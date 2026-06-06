import { Code, ExternalLink, Folder } from 'lucide-react';
import type { Project } from '../types';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a className="project-card" href={project.liveDemoUrl} target="_blank" rel="noreferrer">
      <div>
        <span className="project-id">
          <Folder size={14} /> {project.id}
        </span>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
      </div>
      <div className="tag-row">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="project-meta">
        <strong>
          <Code size={14} /> {project.status}
        </strong>
      </div>
    </a>
  );
}
