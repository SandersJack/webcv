import { useRef, useState, type FormEvent, type ReactNode } from 'react'

import { profile } from '../content/profile'
import { sendContactMessage } from '../lib/contactApi'
import {
  hasErrors,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from '../lib/validation'

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'success' }
  | { kind: 'rate-limited' }
  | { kind: 'server' }
  | { kind: 'offline' }

type StatusView = {
  className: string
  content: ReactNode
}

function statusView(status: FormStatus): StatusView | null {
  switch (status.kind) {
    case 'idle':
    case 'pending':
      return null
    case 'success':
      return {
        className: 'status status--success',
        content: "Message sent — thank you. I'll reply as soon as I can.",
      }
    case 'rate-limited':
      return {
        className: 'status status--error',
        content:
          'This form is rate limited. Please wait a few minutes and try again — your message has been kept.',
      }
    case 'server':
      return {
        className: 'status status--error',
        content: (
          <>
            The message could not be sent. Please try again, or email{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a> directly —
            your message has been kept.
          </>
        ),
      }
    case 'offline':
      return {
        className: 'status status--error',
        content:
          'You appear to be offline. Check your connection and try again — your message has been kept.',
      }
  }
}

const emptyValues: ContactValues = { name: '', email: '', message: '' }

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(emptyValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle' })

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  function updateField(field: keyof ContactValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function focusFirstInvalid(fieldErrors: ContactErrors) {
    if (fieldErrors.name !== undefined) {
      nameRef.current?.focus()
    } else if (fieldErrors.email !== undefined) {
      emailRef.current?.focus()
    } else if (fieldErrors.message !== undefined) {
      messageRef.current?.focus()
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fieldErrors = validateContact(values)
    setErrors(fieldErrors)
    if (hasErrors(fieldErrors)) {
      setStatus({ kind: 'idle' })
      focusFirstInvalid(fieldErrors)
      return
    }

    setStatus({ kind: 'pending' })
    const result = await sendContactMessage(values)
    if (result.ok) {
      setStatus({ kind: 'success' })
      setValues(emptyValues)
    } else {
      setStatus({ kind: result.reason })
    }
  }

  const view = statusView(status)
  const sending = status.kind === 'pending'

  return (
    <form noValidate onSubmit={onSubmit}>
      <div className="field">
        <label className="field__label" htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="field__control"
          ref={nameRef}
          value={values.name}
          onChange={(event) => updateField('name', event.target.value)}
          aria-invalid={errors.name !== undefined}
          aria-describedby={
            errors.name !== undefined ? 'contact-name-error' : undefined
          }
        />
        {errors.name !== undefined && (
          <p className="field__error" id="contact-name-error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field__control"
          ref={emailRef}
          value={values.email}
          onChange={(event) => updateField('email', event.target.value)}
          aria-invalid={errors.email !== undefined}
          aria-describedby={
            errors.email !== undefined ? 'contact-email-error' : undefined
          }
        />
        {errors.email !== undefined && (
          <p className="field__error" id="contact-email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          className="field__control"
          ref={messageRef}
          value={values.message}
          onChange={(event) => updateField('message', event.target.value)}
          aria-invalid={errors.message !== undefined}
          aria-describedby={
            errors.message !== undefined ? 'contact-message-error' : undefined
          }
        />
        {errors.message !== undefined && (
          <p className="field__error" id="contact-message-error" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="button button--primary"
        disabled={sending}
      >
        {sending ? 'Sending…' : 'Send message'}
      </button>

      {view !== null && (
        <p role="status" className={view.className}>
          {view.content}
        </p>
      )}
    </form>
  )
}
