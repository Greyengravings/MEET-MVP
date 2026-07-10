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
    <div className="absolute top-0 left-0 right-0 p-3 z-30 flex items-center justify-between md:justify-start gap-3 text-white pointer-events-none pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div
        className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full pointer-events-auto cursor-pointer border border-white/5 active:bg-white/10 transition-colors"
        onClick={onInfoClick}
      >
        <span className="tabular-nums text-sm font-medium">{time}</span>
        <span className="text-white/20">|</span>
        <span className="font-mono text-sm text-white/80">{roomId}</span>
      </div>

      {raisedHands.length > 0 && (
        <div className="flex items-center gap-2 bg-accent-purple px-3 py-1.5 rounded-full text-xs font-bold pointer-events-auto shadow-lg animate-in slide-in-from-top-2 duration-300 uppercase tracking-tight">
          <Hand className="w-3.5 h-3.5 fill-current" />
          <span>{raisedHandText()}</span>
        </div>
      )}
    </div>
  );
};

export default MeetingInfoBar;
