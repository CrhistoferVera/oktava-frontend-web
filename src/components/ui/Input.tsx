import { InputHTMLAttributes } from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const Input = ({label, id, className = "", ...props}:InputProps) => {
  return (
    <div className='flex flex-col gap-2 w-full min-w-0'>
        <label htmlFor={id}
        className='text-sm text-gray-400 font-medium'>
            {label}
        </label>
        <input id={id} className={`
          bg-black
          border border-gray-700
          rounded-lg
          px-4 py-3
          text-gray-300
          placeholder-gray-600
          focus:outline-none
          focus:ring-2
          focus:ring-red-500
          focus:border-transparent
          transition-all
          ${className}
        `} {...props} />
    </div>
  )
}
