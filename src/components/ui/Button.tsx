import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-red-700 hover:bg-red-600 text-white',
    secondary: 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500',  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}