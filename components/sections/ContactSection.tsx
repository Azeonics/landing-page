'use client';

import { useState, type FormEvent } from 'react';
import {
  contactHead,
  contactSub,
  contactInfo,
  contactFormFields,
  contactSubmitLabel,
  contactSuccessMessage,
} from '@/lib/content/contact';
import Reveal from '@/components/ui/Reveal';
import TelemetryTag from '@/components/ui/TelemetryTag';
import { renderEm } from '@/components/ui/richText';

interface ContactSectionProps {
  /** Anchor id for deep links (e.g. `/contact#contact`). */
  id?: string;
}

type FormValues = Record<string, string>;
type FieldErrors = Record<string, string>;
type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Client-side mirror of the server limits in app/api/contact/security.ts
 * (SECURITY_CONFIG + validateInput). Keep in sync.
 */
const LIMITS = {
  NAME_MAX: 100,
  EMAIL_MAX: 254,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 5000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[a-zA-Z\s\-'.]+$/;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = (values.name ?? '').trim();
  const email = (values.email ?? '').trim();
  const interest = values.interest ?? '';
  const message = (values.message ?? '').trim();

  if (!name) errors.name = 'Name is required.';
  else if (name.length > LIMITS.NAME_MAX)
    errors.name = `Name must be under ${LIMITS.NAME_MAX} characters.`;
  else if (!NAME_RE.test(name))
    errors.name = 'Use letters, spaces, hyphens, apostrophes and periods only.';

  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  else if (email.length > LIMITS.EMAIL_MAX) errors.email = 'Email is too long.';

  if (!interest) errors.interest = 'Pick what you are interested in.';

  if (!message) errors.message = 'Tell us a little about your mission.';
  else if (message.length < LIMITS.MESSAGE_MIN)
    errors.message = `Message must be at least ${LIMITS.MESSAGE_MIN} characters.`;
  else if (message.length > LIMITS.MESSAGE_MAX)
    errors.message = `Message must be under ${LIMITS.MESSAGE_MAX} characters.`;

  return errors;
}

/** Render an info value as mailto:/tel: when it is an email / phone number. */
function InfoValue({ value }: { value: string }) {
  if (value.includes('@')) {
    return (
      <a className="mcontact-info-link" href={`mailto:${value}`}>
        {value}
      </a>
    );
  }
  if (/^\+?[\d\s()-]+$/.test(value)) {
    return (
      <a className="mcontact-info-link" href={`tel:${value.replace(/[^\d+]/g, '')}`}>
        {value}
      </a>
    );
  }
  return <>{value}</>;
}

/**
 * Contact: editorial info column + the enquiry form wired to /api/contact.
 * The JSON contract (keys name/email/interest/message, interest whitelist)
 * is defined by lib/content/contact.ts and must match the API route.
 */
export default function ContactSection({ id = 'contact' }: ContactSectionProps) {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    interest: '',
    message: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Honeypot tripped: pretend success, never hit the API.
    if (honeypot) {
      setStatus('success');
      return;
    }

    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setStatus('sending');
    setServerError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          interest: values.interest,
          message: values.message.trim(),
        }),
      });

      if (res.ok) {
        setStatus('success');
        return;
      }

      let message = 'Something went wrong on our side. Please try again.';
      try {
        const data: unknown = await res.json();
        if (
          data &&
          typeof data === 'object' &&
          'error' in data &&
          typeof (data as { error: unknown }).error === 'string'
        ) {
          message = (data as { error: string }).error;
        }
      } catch {
        /* non-JSON error body — keep the generic message */
      }
      setServerError(message);
      setStatus('error');
    } catch {
      setServerError('Could not reach the server. Check your connection and try again.');
      setStatus('error');
    }
  }

  const isSending = status === 'sending';

  return (
    <section className="mcontact" id={id}>
      <div className="wrap mcontact-grid">
        <Reveal>
          <div className="mcontact-left">
            <div className="mcontact-head-row">
              <span className="mcontact-num">{contactHead.num}</span>
              <span className="mcontact-label">{contactHead.name}</span>
            </div>
            <h1 className="mcontact-title">{renderEm(contactHead.title)}</h1>
            <p className="mcontact-sub">{contactSub}</p>
            <dl className="mcontact-info">
              {contactInfo.map((row) => (
                <div className="mcontact-info-row" key={row.label}>
                  <dt className="mcontact-info-label">{row.label}</dt>
                  <dd className="mcontact-info-value">
                    <InfoValue value={row.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {status === 'success' ? (
            <div className="mcontact-success" role="status">
              <TelemetryTag pulse>Transmission received</TelemetryTag>
              <p className="mcontact-success-title">
                Your signal is on its way to mission control.
              </p>
              <p className="mcontact-success-msg">{contactSuccessMessage}</p>
            </div>
          ) : (
            <form className="mcontact-form" onSubmit={handleSubmit} noValidate>
              {contactFormFields.map((field) => {
                const error = errors[field.name];
                const errorId = `${field.id}-error`;
                const shared = {
                  id: field.id,
                  name: field.name,
                  required: field.required,
                  disabled: isSending,
                  'aria-invalid': error ? true : undefined,
                  'aria-describedby': error ? errorId : undefined,
                } as const;

                return (
                  <div className="mcontact-field" key={field.id}>
                    <label className="mcontact-field-label" htmlFor={field.id}>
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        {...shared}
                        className="mcontact-input mcontact-select"
                        value={values[field.name] ?? ''}
                        onChange={(e) => setField(field.name, e.target.value)}
                      >
                        <option value="" disabled>
                          {field.placeholder ?? 'Select an option'}
                        </option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        {...shared}
                        className="mcontact-input mcontact-textarea"
                        placeholder={field.placeholder}
                        rows={5}
                        maxLength={LIMITS.MESSAGE_MAX}
                        value={values[field.name] ?? ''}
                        onChange={(e) => setField(field.name, e.target.value)}
                      />
                    ) : (
                      <input
                        {...shared}
                        className="mcontact-input"
                        type={field.type}
                        placeholder={field.placeholder}
                        maxLength={field.type === 'email' ? LIMITS.EMAIL_MAX : LIMITS.NAME_MAX}
                        value={values[field.name] ?? ''}
                        onChange={(e) => setField(field.name, e.target.value)}
                      />
                    )}
                    {error ? (
                      <p className="mcontact-error" id={errorId}>
                        {error}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              {/* Honeypot — invisible to humans, tempting to bots. */}
              <div className="mcontact-hp" aria-hidden="true">
                <label htmlFor="f-company">Company</label>
                <input
                  id="f-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {status === 'error' && serverError ? (
                <p className="mcontact-alert" role="alert">
                  {serverError}
                </p>
              ) : null}

              <button className="mcontact-submit" type="submit" disabled={isSending}>
                {isSending ? 'Transmitting…' : contactSubmitLabel}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
