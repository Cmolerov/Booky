import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-sm border-2 border-slate-100 ${className}`}>
      {children}
    </div>
  );
};
