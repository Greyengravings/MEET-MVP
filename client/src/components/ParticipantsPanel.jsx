import React from 'react';
import { X, Mic, MicOff, Video, VideoOff, Hand, Users } from 'lucide-react';
import { cn } from '../lib/utils';

const ParticipantsPanel = ({ participants, localUser, onClose, isMobile }) => {
  const allParticipants = [
    { ...localUser, isLocal: true, socketId: 'local' },
    ...participants
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-dark-bg text-white",
      !isMobile && "border-l border-white/5"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-white/10 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          {isMobile && <Users className="w-5 h-5 text-accent-purple" />}
          <h3 className="text-lg font-medium">People</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors" aria-label="Close participants">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">
          In call · {allParticipants.length}
        </div>
        <div className="space-y-1">
          {allParticipants.map((p) => (
            <div key={p.socketId} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent-purple rounded-full flex items-center justify-center text-white text-sm font-bold uppercase shadow-lg border border-white/10">
                  {p.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {p.name} {p.isLocal && '(You)'}
                  </span>
                  {p.isHandRaised && (
                    <span className="text-[10px] text-accent-purple font-bold flex items-center gap-1 uppercase tracking-tighter">
                      <Hand className="w-3 h-3 fill-current" /> Hand raised
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {p.isMicOn ? (
                  <Mic className="w-4 h-4 text-white/30" />
                ) : (
                  <MicOff className="w-4 h-4 text-red-500" />
                )}
                {p.isCamOn ? (
                  <Video className="w-4 h-4 text-white/30" />
                ) : (
                  <VideoOff className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-white/10 bg-black/20 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button className="w-full py-3.5 px-4 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-colors shadow-sm uppercase tracking-widest">
          Add people
        </button>
      </div>
    </div>
  );
};

export default ParticipantsPanel;
