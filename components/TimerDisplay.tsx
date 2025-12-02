import React from 'react';

interface TimerDisplayProps {
  seconds: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, size = 'md', className = '' }) => {
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const sizeClasses = {
    sm: 'text-sm font-medium',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-bold tracking-tight',
    xl: 'text-5xl font-black tracking-tighter'
  };

  return (
    <div className={`font-mono ${sizeClasses[size]} ${className}`}>
      {formatTime(seconds)}
    </div>
  );
};