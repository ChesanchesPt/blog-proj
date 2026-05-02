import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export const ButtonSubmit = ({ children, loading, disabled, className = '', ...props }: ButtonProps) => {
  const base = `w-full flex flex-col text-sm font-bold rounded-md bg-black text-white px-4 py-3 mb-8 
  transition-shadow hover:bg-accent hover:shadow-[4px_4px_0px_#1A1A1A]
  active:shadow-none`

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Загрузка...
        </span>
      ) : (
        children
      )}
    </button>
  )
}