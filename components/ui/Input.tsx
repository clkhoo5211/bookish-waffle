'use client';

import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  onChange: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  onChange,
  className = '',
  required,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all';
  const normalClasses = 'border-gray-200 focus:border-[#00a19c] focus:ring-[#00a19c] bg-white text-[#1e293c]';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50';
  const disabledClasses = 'bg-gray-100 cursor-not-allowed opacity-60';
  
  const classes = `${baseClasses} ${
    error ? errorClasses : disabledClasses && props.disabled ? disabledClasses : normalClasses
  } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#1e293c] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={classes}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
};

