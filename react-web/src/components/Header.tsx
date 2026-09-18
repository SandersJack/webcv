import { useRef, useState, type KeyboardEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/mobile-development', label: 'Mobile development' },
  { to: '/physics', label: 'Physics' },
  { to: '/water-polo', label: 'Water polo' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

/**
 * Desktop shows an inline nav; below 48rem a labelled disclosure button
 * toggles the menu. Escape closes it, and it closes on navigation.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const [prevPathname, setPrevPathname] = useState(location.pathname)

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname)
    setMenuOpen(false)
  }

  function onNavKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && menuOpen) {
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          Jack Sanders
        </Link>
        <button
          type="button"
          ref={toggleRef}
          className="site-nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close menu' : 'Menu'}
        </button>
        <nav
          id="primary-navigation"
          aria-label="Primary"
          className="site-nav"
          hidden={!menuOpen || undefined}
          onKeyDown={onNavKeyDown}
        >
          <ul className="site-nav__list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className="site-nav__link"
                  aria-current={location.pathname.startsWith(item.to) ? 'page' : undefined}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
