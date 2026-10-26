'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, icon, iconPosition = 'left', id, ...props }, ref) => {
    const inputId = id || React.useId()
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-900 transition-colors peer-focus-within:text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-all duration-200',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              'aria-invalid:focus:ring-error',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              error && 'border-error focus:ring-error',
              !error && 'border-input hover:border-primary/50',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {icon}
            </div>
          )}
          {error && (
            <span id={errorId} className="absolute -bottom-5 left-0 text-xs text-error" role="alert">
              {error}
            </span>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

/* Textarea component */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || React.useId()
    const errorId = error ? `${textareaId}-error` : undefined
    const hintId = hint ? `${textareaId}-hint` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-gray-900 transition-colors peer-focus-within:text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[120px] w-full rounded-xl border bg-background px-4 py-3 text-sm font-medium transition-all duration-200 resize-y',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
            'aria-invalid:focus:ring-error',
            error && 'border-error focus:ring-error',
            !error && 'border-input hover:border-primary/50',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

/* Select component */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  placeholder?: string
  options: { value: string; label: string }[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, placeholder, options, id, ...props }, ref) => {
    const selectId = id || React.useId()
    const errorId = error ? `${selectId}-error` : undefined
    const hintId = hint ? `${selectId}-hint` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-gray-900 transition-colors peer-focus-within:text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-all duration-200 appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              'aria-invalid:focus:ring-error',
              error && 'border-error focus:ring-error',
              !error && 'border-input hover:border-primary/50',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

/* Label component */
const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    />
  )
)
Label.displayName = 'Label'

export { Input, Textarea, Select, Label }