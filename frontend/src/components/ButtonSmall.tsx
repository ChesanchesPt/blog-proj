import { Button } from './Button'
import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'base' | 'accent' | 'disabled'
}

export const ButtonSmall = ({ variant = 'base', ...props }: ButtonProps) => (
  <Button variant={variant} {...props} />
)