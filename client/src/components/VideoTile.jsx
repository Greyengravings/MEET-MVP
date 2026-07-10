import React, { useEffect, useRef } from 'react';
import { MicOff, VideoOff, Hand } from 'lucide-react';
import { cn } from '../lib/utils';

const VideoTile = ({ stream, name, isLocal, isMuted, isCamOff, isHandRaised }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isCamOff]);

  return (
    <div className="video-tile-container group h-full w-full relative bg-dark-surface overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          (isCamOff || !stream) ? "opacity-0 absolute" : "opacity-100",
          isLocal && "scale-x-[-1]"
        )}
      />

      {/* Avatar Placeholder */}
      {(isCamOff || !stream) && (
        <div className="absolute inset-0 flex items-center justify-center animate-in fade-in duration-500">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent-purple rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-2xl border-4 border-white/10 uppercase">
            {name ? name.charAt(0) : '?'}
          </div>
        </div>
      )}
      
      {/* Hand Raise Badge */}
      {isHandRaised && (
        <div className="absolute top-3 right-3 bg-accent-purple text-white p-2 rounded-full shadow-lg animate-bounce z-10">
          <Hand className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </div>
      )}

      {/* Overlay Info (Bottom Left) */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-10 max-w-[calc(100%-24px)]">
        <span className="text-xs sm:text-sm font-medium text-white truncate">
          {name} {isLocal && '(You)'}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {isMuted && (
            <div className="bg-red-500 rounded-full p-1 shadow-sm">
               <MicOff className="w-3 h-3 text-white" />
            </div>
          )}
          {isCamOff && (
            <div className="bg-red-500 rounded-full p-1 shadow-sm">
               <VideoOff className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Active Speaker Border (Simulated/Placeholder) */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-purple/30 pointer-events-none transition-colors rounded-xl" />
    </div>
  );
};

export default VideoTile;
