import { FormEvent, useState } from 'react';
import { FileText } from 'lucide-react';
import type { Project, ProjectStatus, VimDraft } from '../types';

type VimEditorModalProps = {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
};

export function VimEditorModal({ project, onSave, onCancel }: VimEditorModalProps) {
  const [draft, setDraft] = useState<VimDraft>({
    id: project.id,
    title: project.title,
    description: project.description,
    tags: project.tags.join(', '),
    status: project.status,
    liveDemoUrl: project.liveDemoUrl,
  });

  const save = (event: FormEvent) => {
    event.preventDefault();
    onSave({
      ...project,
      title: draft.title,
      description: draft.description,
      tags: draft.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: draft.status,
      liveDemoUrl: draft.liveDemoUrl || '#',
    });
  };

  return (
    <div className="vim-backdrop" role="dialog" aria-modal="true" aria-label={`VIM_EDITOR: ${project.id}`}>
      <form className="vim-modal" onSubmit={save}>
        <header>
          <span>
            <FileText size={14} /> VIM_EDITOR: {project.id}
          </span>
          <button type="button" onClick={onCancel}>
            ×
          </button>
        </header>
        <label>
          title
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </label>
        <label>
          description
          <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
        </label>
        <label>
          tags
          <input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} />
        </label>
        <label>
          status
          <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ProjectStatus })}>
            <option value="LIVE">LIVE</option>
            <option value="DEV">DEV</option>
            <option value="CASE_STUDY">CASE_STUDY</option>
          </select>
        </label>
        <div className="vim-actions">
          <button type="submit">[ SAVE ]</button>
          <button type="button" onClick={onCancel}>
            [ CANCEL ]
          </button>
        </div>
      </form>
    </div>
  );
}
