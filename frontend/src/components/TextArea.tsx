import { type TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const TextArea = ({ label, error, id, className = '', ...props }: TextAreaProps) => {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={textareaId} className="text-sm font-bold text-black">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`w-full border-3 border-black shadow-[4px_4px_0px_#1A1A1A] px-3 py-3
          text-sm font-medium bg-white outline-none
          focus:ring-2 focus:ring-neo-accent
          transition-shadow hover:shadow-[2px_2px_0px_#1A1A1A] resize-y
          ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600 font-medium">{error}</span>
      )}
    </div>
  )
}
