import React from 'react';
import { ThumbsUp, Users } from 'lucide-react';

interface PhotoPlaceholderProps {
  type: 'thumbs-up-person' | 'community-globe';
  className?: string;
}

export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({ type, className = '' }) => {
  if (type === 'thumbs-up-person') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#1e293c] via-[#2a3a52] to-[#1e293c] flex items-center justify-center ${className}`}>
        {/* Placeholder for professional person with thumbs up photo */}
        <div className="text-center">
          <ThumbsUp size={64} className="text-[#00a19c]" strokeWidth={1.5} />
          <p className="text-white/60 text-xs mt-2">Photo placeholder</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>
    );
  }

  if (type === 'community-globe') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#1e293c] via-[#2a3a52] to-[#1e293c] flex items-center justify-center ${className}`}>
        {/* Placeholder for community with globe photo */}
        <div className="text-center">
          <Users size={64} className="text-[#00a19c]" strokeWidth={1.5} />
          <p className="text-white/60 text-xs mt-2">Photo placeholder</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>
    );
  }

  return null;
};
