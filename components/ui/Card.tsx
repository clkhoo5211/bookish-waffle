'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-100 shadow-sm p-6';
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';
  
  const classes = `${baseClasses} ${interactiveClasses} ${className}`;

  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

