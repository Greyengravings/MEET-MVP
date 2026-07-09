import React, { useEffect, useRef, useState } from 'react';
import { MicOff } from 'lucide-react';
import { cn } from '../lib/utils';

const VideoTile = ({ stream, name, isLocal, isMuted, isCamOff }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // If camera is off, we hide the video element and show the avatar.
  // For local, we use the 'isCamOff' prop.
  // For remote, 'isCamOff' is passed from the peers array state.
  const shouldShowVideo = stream && !isCamOff;

  return (
    <div className="video-tile-container group">
      {shouldShowVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video to prevent echo
          className={cn(
            "w-full h-full object-cover",
            isLocal && "scale-x-[-1]"
          )}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#202124]">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-600 rounded-full flex items-center justify-center text-2xl sm:text-4xl font-bold uppercase shadow-xl">
            {name ? name.charAt(0) : '?'}
          </div>
          <span className="mt-3 text-[#9aa0a6] text-xs sm:text-sm">Camera is off</span>
        </div>
      )}
      
      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 max-w-[80%]">
        <span className="text-xs sm:text-sm font-medium text-white truncate">
          {name} {isLocal && '(You)'}
        </span>
        {isMuted && (
          <div className="bg-[#ea4335] rounded-full p-0.5">
             <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTile;
