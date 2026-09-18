import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonLinkProps = {
  to: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

/** A navigation link styled as a button. Remains a real anchor. */
export function ButtonLink({ to, variant = 'primary', children }: ButtonLinkProps) {
  return (
    <Link to={to} className={`button button--${variant}`}>
      {children}
    </Link>
  )
}
