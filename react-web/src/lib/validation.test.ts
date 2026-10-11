import { describe, expect, it } from 'vitest'

import { hasErrors, NAME_MAX, validateContact } from './validation'

describe('validateContact', () => {
  it('returns name, email, and message errors for an empty submission', () => {
    const errors = validateContact({ name: '', email: '', message: '' })

    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.message).toBeDefined()
    expect(hasErrors(errors)).toBe(true)
  })

  it('returns only an email error for a malformed email address', () => {
    const errors = validateContact({
      name: 'Ada Lovelace',
      email: 'not-an-email',
      message: 'Hello there',
    })

    expect(errors.email).toBeDefined()
    expect(errors.name).toBeUndefined()
    expect(errors.message).toBeUndefined()
    expect(hasErrors(errors)).toBe(true)
  })

  it('returns only a name error when the name exceeds the maximum length', () => {
    const errors = validateContact({
      name: 'a'.repeat(NAME_MAX + 1),
      email: 'ada@example.com',
      message: 'Hello there',
    })

    expect(errors.name).toBeDefined()
    expect(errors.email).toBeUndefined()
    expect(errors.message).toBeUndefined()
    expect(hasErrors(errors)).toBe(true)
  })

  it('returns no errors for valid input', () => {
    const errors = validateContact({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello there',
    })

    expect(errors).toEqual({})
    expect(hasErrors(errors)).toBe(false)
  })
})
