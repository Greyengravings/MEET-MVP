import React, { useState, useEffect } from 'react';
import { Info, Hand } from 'lucide-react';
import { cn } from '../lib/utils';

const MeetingInfoBar = ({ roomId, raisedHands = [], onInfoClick }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const raisedHandText = () => {
    if (raisedHands.length === 0) return null;
    if (raisedHands.length === 1) return `${raisedHands[0].name} ✋`;
    return `${raisedHands[0].name} ✋ +${raisedHands.length - 1}`;
  };

  return (
    <div className="absolute top-0 left-0 p-4 z-30 flex items-center gap-4 text-white select-none pointer-events-none pt-[max(1rem,env(safe-area-inset-top))]">
      <div
        className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg pointer-events-auto cursor-pointer hover:bg-black/40 transition-colors"
        onClick={onInfoClick}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-sm font-medium">
          <span className="tabular-nums">{time}</span>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="font-mono text-white/90">{roomId}</span>
          <Info className="w-4 h-4 text-white/60 ml-1 hidden md:block" />
        </div>
      </div>

      {raisedHands.length > 0 && (
        <div className="flex items-center gap-2 bg-accent-purple/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium animate-in slide-in-from-left-4 duration-300">
          <Hand className="w-4 h-4 fill-current" />
          <span>{raisedHandText()}</span>
        </div>
      )}
    </div>
  );
};

export default MeetingInfoBar;
