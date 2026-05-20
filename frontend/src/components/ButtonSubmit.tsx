import { Button } from './Button'
import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  variant?: 'base' | 'accent'
}

export const ButtonSubmit = ({ variant = 'base', ...props }: ButtonProps) => (
  <Button variant={variant} {...props} />
)