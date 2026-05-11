import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'base' | 'accent'
}

export const ButtonSmall = ({ 
  children, 
  variant = 'base',
  className = '', 
  ...props 
}: ButtonProps) => {

  const baseStyles = `
    w-full 
    flex 
    justify-center 
    items-center 
    text-sm 
    font-bold 
    px-4 
    py-3 
    transition-all 
    duration-200
    disabled:opacity-50 
    disabled:cursor-not-allowed
  `

  const variants = {
    base: `
      bg-black 
      text-white 
      hover:bg-accent 
      hover:shadow-[4px_4px_0px_#1A1A1A]
      active:shadow-none
      active:translate-x-[2px]
      active:translate-y-[2px]
    `,
    accent: `
      bg-accent 
      text-white 
      hover:bg-accent-dark 
      hover:shadow-[4px_4px_0px_#1A1A1A]
      active:shadow-none
      active:translate-x-[2px]
      active:translate-y-[2px]
    `
  }

  const buttonClasses = `${baseStyles} ${variants[variant]} ${className}`

  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  )
}