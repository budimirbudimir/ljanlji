import { useState } from 'react'

type Strings = {
  name: string
  email: string
  message: string
  send: string
  sending: string
  success: string
  error: string
}

export default function ContactForm({ strings, lang }: { strings: Strings; lang: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    // honeypot check
    if (data['_hp']) return

    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message, lang }),
      })

      if (res.ok) {
        setStatus('ok')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      {/* Honeypot — hidden from real users */}
      <input name="_hp" type="text" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

      <div className="form-group">
        <label htmlFor="cf-name">{strings.name}</label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          disabled={status === 'sending' || status === 'ok'}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cf-email">{strings.email}</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          disabled={status === 'sending' || status === 'ok'}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cf-message">{strings.message}</label>
        <textarea
          id="cf-message"
          name="message"
          required
          maxLength={2000}
          rows={6}
          disabled={status === 'sending' || status === 'ok'}
        />
      </div>

      {status === 'ok' && (
        <div className="form-feedback success">{strings.success}</div>
      )}
      {status === 'error' && (
        <div className="form-feedback error">{strings.error}</div>
      )}

      <button type="submit" className="btn-primary" disabled={status === 'sending' || status === 'ok'}>
        {status === 'sending' ? strings.sending : strings.send}
      </button>

      <style>{`
        .contact-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mid);
          font-weight: 600;
        }
        .form-group input,
        .form-group textarea {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--dark);
          background: #fff;
          border: 1.5px solid rgba(90,144,96,0.35);
          border-radius: 3px;
          padding: 11px 14px;
          outline: none;
          transition: border-color 0.15s;
          resize: vertical;
          width: 100%;
        }
        .form-group input:focus,
        .form-group textarea:focus { border-color: var(--sage); }
        .form-group input:disabled,
        .form-group textarea:disabled { opacity: 0.6; cursor: not-allowed; }
        .form-feedback {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          padding: 12px 16px;
          border-radius: 3px;
        }
        .form-feedback.success {
          background: rgba(90,144,96,0.12);
          color: var(--sage-dark);
          border: 1px solid var(--sage-light);
        }
        .form-feedback.error {
          background: rgba(196,98,45,0.08);
          color: var(--terracotta);
          border: 1px solid rgba(196,98,45,0.25);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
      `}</style>
    </form>
  )
}
