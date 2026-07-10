import React, { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

const ComingSoonToast = ({ featureName, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={cn(
      "fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 pointer-events-none",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <div className="bg-dark-surface border border-white/10 rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl pointer-events-auto">
        <div className="bg-accent-purple/20 p-1.5 rounded-full">
          <Info className="w-4 h-4 text-accent-purple" />
        </div>
        <span className="text-sm font-medium text-white whitespace-nowrap">
          {featureName ? `${featureName} — Coming soon` : 'Feature coming soon'}
        </span>
        <button
          onClick={handleClose}
          className="ml-2 p-0.5 hover:bg-white/5 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-white/40" />
        </button>
      </div>
    </div>
  );
};

export default ComingSoonToast;
