import { type InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = ({ label, error, id, className = '', ...props }: TextFieldProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor={inputId} className="text-sm font-bold text-neo-black">
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-81 border-3 border-neo-black
          px-3 py-3 text-sm font-medium bg-white
          outline-none rounded-md focus:border-accent
          transition-colors
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