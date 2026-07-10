import React from 'react';
import { X, Mic, MicOff, Video, VideoOff, Hand } from 'lucide-react';
import { cn } from '../lib/utils';

const ParticipantsPanel = ({ participants, localUser, onClose }) => {
  const allParticipants = [
    { ...localUser, isLocal: true, socketId: 'local' },
    ...participants
  ];

  return (
    <div className="flex flex-col h-full bg-dark-bg text-white border-l border-white/5">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-lg font-medium">People</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider">
          In call
        </div>
        {allParticipants.map((p) => (
          <div key={p.socketId} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center text-white text-xs font-bold uppercase shadow-lg">
                {p.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {p.name} {p.isLocal && '(You)'}
                </span>
                {p.isHandRaised && (
                  <span className="text-[10px] text-accent-purple font-medium flex items-center gap-1">
                    <Hand className="w-3 h-3 fill-current" /> Hand raised
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {p.isMicOn ? (
                <Mic className="w-4 h-4 text-white/40" />
              ) : (
                <MicOff className="w-4 h-4 text-red-500" />
              )}
              {p.isCamOn ? (
                <Video className="w-4 h-4 text-white/40" />
              ) : (
                <VideoOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 bg-white/5">
        <button className="w-full py-2.5 px-4 rounded-full border border-white/20 text-sm font-medium hover:bg-white/10 transition-colors">
          Add people
        </button>
      </div>
    </div>
  );
};

export default ParticipantsPanel;
