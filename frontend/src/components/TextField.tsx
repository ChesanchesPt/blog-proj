import { type InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = ({ label, error, id, className = '', ...props }: TextFieldProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-bold text-black">
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-81 border-3 border-black px-3 py-2 text-sm font-medium bg-white outline-none 
          focus:ring-2 focus:ring-accent 
          transition-shadow hover:shadow-[1px_1px_0px_#1A1A1A]
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {error && (
        <p className="text-xs font-bold text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}