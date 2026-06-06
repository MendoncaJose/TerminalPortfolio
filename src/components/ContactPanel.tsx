import { FormEvent, useState } from 'react';
import { FaGithubAlt, FaLinkedinIn } from 'react-icons/fa';

export function ContactPanel() {
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const submitTransmission = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!from.trim()) {
      setStatus('error');
      setStatusMessage('[ERR] sender address is required');
      return;
    }

    if (!subject.trim()) {
      setStatus('error');
      setStatusMessage('[ERR] subject line is required');
      return;
    }

    if (!message.trim()) {
      setStatus('error');
      setStatusMessage('[ERR] transmission buffer is empty');
      return;
    }

    setStatus('sending');
    setStatusMessage('[TX] sending encrypted payload...');

    try {
      const response = await fetch('/api/transmit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, subject, message }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Transmission failed');
      }

      setMessage('');
      setStatus('success');
      setStatusMessage('[OK] transmission delivered');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? `[ERR] ${error.message}` : '[ERR] transmission failed');
    }
  };

  return (
    <div className="contact-view">
      <div className="handshake-header">
        <h1>INITIALIZE_HANDSHAKE</h1>
        <p>Transmission channels are open. Send your signal across the network.</p>
      </div>

      <div className="contact-actions contact-channel-grid">
        <a href="https://github.com/MendoncaJose" target="_blank" rel="noreferrer" aria-label="Open GitHub">
          <FaGithubAlt />
          <span>GITHUB</span>
        </a>
        <a href="https://www.linkedin.com/in/jos%C3%A9-mendon%C3%A7a-b8a761188/" target="_blank" rel="noreferrer" aria-label="Open Linkedin">
          <FaLinkedinIn />
          <span>LINKEDIN</span>
        </a>
      </div>

      <form className="transmission-panel" onSubmit={submitTransmission}>
        <label htmlFor="transmissionMessage">encryption: enabled (pgp-2048)</label>
        <div className="transmission-fields">
          <label htmlFor="transmissionFrom">
            reply_to:
            <input
              id="transmissionFrom"
              type="email"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder="your@email.com"
            />
          </label>
          <label htmlFor="transmissionSubject">
            subject:
            <input
              id="transmissionSubject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Let's build something"
            />
          </label>
        </div>
        <textarea
          id="transmissionMessage"
          placeholder="> Enter transmission message..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button className="transmit-button" disabled={status === 'sending'} type="submit">
          {status === 'sending' ? '[ TRANSMITTING... ]' : '[ TRANSMIT_DATA ]'}
        </button>
        {statusMessage && (
          <p className="transmission-status" data-status={status}>
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}
