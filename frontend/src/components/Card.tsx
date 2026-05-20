import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`card-border card-shadow bg-white p-4 transition-shadow ${className}`}>
    {children}
  </div>
)
