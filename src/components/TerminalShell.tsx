import { FormEvent, useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import type { Directory, Project, Section } from '../types';
import { directoryPrompt } from '../utils/terminal';
import { Panel } from './Panel';

type TerminalShellProps = {
  currentDirectory: Directory;
  terminalHistory: string[];
  onCommand: (command: string) => void;
};

export function TerminalShell({ currentDirectory, terminalHistory, onCommand }: TerminalShellProps) {
  const [command, setCommand] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [terminalHistory]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!command.trim()) return;
    onCommand(command.trim());
    setCommand('');
  };

  return (
    <Panel title="TERMINAL_SHELL_V2.4" className="shell-panel">
      <div className="shell-lines" ref={scrollRef}>
        {terminalHistory.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <form className="shell-input-row" onSubmit={submit} onClick={() => inputRef.current?.focus()}>
        <label htmlFor="terminalCommand">
          <Terminal size={14} /> {directoryPrompt(currentDirectory)}
        </label>
        <div className="terminal-input-wrap">
          <input
            ref={inputRef}
            id="terminalCommand"
            value={command}
            style={{ width: `${Math.min(Math.max(command.length + 1, 1), 42)}ch` }}
            onChange={(event) => setCommand(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command"
          />

          <span className="cursor terminal-caret">█</span>
        </div>
      </form>
    </Panel>
  );
}
