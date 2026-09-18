import type { ContactValues } from './validation'

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: 'rate-limited' | 'server' | 'offline' }

/**
 * Client for the existing Express contact service (contact-form/server.js).
 * POSTs JSON to /send_email; in dev this is proxied to localhost:3333 and in
 * production NGINX routes it to the same service (see docs/MIGRATION_PLAN.md).
 */
export async function sendContactMessage(
  values: ContactValues,
  fetchImpl: typeof fetch = fetch,
): Promise<ContactResult> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { ok: false, reason: 'offline' }
  }

  try {
    const response = await fetchImpl('/send_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      }),
    })

    if (response.ok) {
      return { ok: true }
    }
    if (response.status === 429) {
      return { ok: false, reason: 'rate-limited' }
    }
    return { ok: false, reason: 'server' }
  } catch {
    return { ok: false, reason: 'offline' }
  }
}
