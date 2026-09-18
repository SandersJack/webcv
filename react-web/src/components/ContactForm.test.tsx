import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ContactForm } from './ContactForm'

afterEach(() => {
  vi.unstubAllGlobals()
})

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('Email'), 'ada@example.com')
  await user.type(screen.getByLabelText('Message'), 'Hello there')
}

describe('ContactForm', () => {
  it('shows all three errors on empty submit and preserves typed values', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submit = screen.getByRole('button', { name: 'Send message' })
    await user.click(submit)

    expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
    expect(
      screen.getByText('Please enter your email address.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Please enter a message.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Message'), 'Hello there')
    await user.click(submit)

    expect(screen.getByLabelText('Name')).toHaveValue('Ada Lovelace')
    expect(screen.getByLabelText('Message')).toHaveValue('Hello there')
    expect(
      screen.getByText('Please enter your email address.'),
    ).toBeInTheDocument()
  })

  it('shows the success message and clears the form after a successful send', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 200 })),
    )
    const user = userEvent.setup()
    render(<ContactForm />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(
      await screen.findByText(
        "Message sent — thank you. I'll reply as soon as I can.",
      ),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Email')).toHaveValue('')
    expect(screen.getByLabelText('Message')).toHaveValue('')
  })

  it('explains the rate limit and preserves values on a 429 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 429 })),
    )
    const user = userEvent.setup()
    render(<ContactForm />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByText(/rate limited/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Ada Lovelace')
    expect(screen.getByLabelText('Email')).toHaveValue('ada@example.com')
    expect(screen.getByLabelText('Message')).toHaveValue('Hello there')
  })

  it('shows the offline message when the request rejects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockRejectedValue(new Error('Network down')),
    )
    const user = userEvent.setup()
    render(<ContactForm />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByText(/appear to be offline/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Ada Lovelace')
    expect(screen.getByLabelText('Email')).toHaveValue('ada@example.com')
    expect(screen.getByLabelText('Message')).toHaveValue('Hello there')
  })
})
