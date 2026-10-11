import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from './ErrorBoundary'

const pageError = new Error('Page exploded')

function ThrowingPage(): never {
  throw pageError
}

function HomePage() {
  return <p>Home page content</p>
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <p>Normal content</p>
        </ErrorBoundary>
      </MemoryRouter>,
    )

    expect(screen.getByText('Normal content')).toBeVisible()
  })

  it('shows the fallback and logs the error when a page crashes', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/bad']}>
        <ErrorBoundary>
          <Routes>
            <Route path="/bad" element={<ThrowingPage />} />
          </Routes>
        </ErrorBoundary>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeVisible()
    expect(
      screen.getByText('An unexpected error occurred. Please try again.'),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(consoleError).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      pageError,
      expect.objectContaining({ componentStack: expect.any(String) }),
    )
  })

  it('clears the error when the route changes', async () => {
    const user = userEvent.setup()
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/bad']}>
        <ErrorBoundary>
          <Routes>
            <Route path="/bad" element={<ThrowingPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </ErrorBoundary>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Something went wrong' }),
    ).toBeVisible()

    await user.click(screen.getByRole('link', { name: 'Back to home' }))

    expect(screen.getByText('Home page content')).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: 'Something went wrong' }),
    ).not.toBeInTheDocument()
  })
})
