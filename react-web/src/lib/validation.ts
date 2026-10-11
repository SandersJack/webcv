export type ContactValues = {
  name: string
  email: string
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>

export const NAME_MAX = 100
export const MESSAGE_MAX = 5000

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}

  const name = values.name.trim()
  if (name.length === 0) {
    errors.name = 'Please enter your name.'
  } else if (name.length > NAME_MAX) {
    errors.name = `Name must be ${NAME_MAX} characters or fewer.`
  }

  const email = values.email.trim()
  if (email.length === 0) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  const message = values.message.trim()
  if (message.length === 0) {
    errors.message = 'Please enter a message.'
  } else if (message.length > MESSAGE_MAX) {
    errors.message = `Message must be ${MESSAGE_MAX} characters or fewer.`
  }

  return errors
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0
}
