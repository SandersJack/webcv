import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { Header } from './Header'

const navLabels = [
  'Physics',
  'Mobile development',
  'Water polo',
  'Projects',
  'About',
  'Contact',
]

describe('Header', () => {
  it('renders all six navigation links', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Menu' }))

    for (const label of navLabels) {
      expect(screen.getByRole('link', { name: label })).toBeVisible()
    }
  })

  it('marks the current page link with aria-current="page"', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Header />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      screen.getByRole('link', { name: 'Physics' }),
    ).not.toHaveAttribute('aria-current')
  })

  it('opens the menu and closes it with Escape, returning focus to the button', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    const toggle = screen.getByRole('button', { name: 'Menu' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    screen.getByRole('link', { name: 'Physics' }).focus()
    await user.keyboard('{Escape}')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })
})
