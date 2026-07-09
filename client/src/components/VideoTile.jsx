import React, { useEffect, useRef, useState } from 'react';
import { MicOff, User } from 'lucide-react';
import { cn } from '../lib/utils';

const VideoTile = ({ stream, name, isLocal, isMuted }) => {
  const videoRef = useRef();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        setIsVideoEnabled(videoTrack.enabled);
        
        const handleTrackChange = () => {
          setIsVideoEnabled(videoTrack.enabled);
        };
        
        videoTrack.addEventListener('mute', handleTrackChange);
        videoTrack.addEventListener('unmute', handleTrackChange);
        const interval = setInterval(() => {
          setIsVideoEnabled(videoTrack.enabled);
        }, 500);

        return () => {
          videoTrack.removeEventListener('mute', handleTrackChange);
          videoTrack.removeEventListener('unmute', handleTrackChange);
          clearInterval(interval);
        };
      }
    }
  }, [stream]);

  return (
    <div className="relative bg-dark-surface rounded-xl overflow-hidden aspect-video flex items-center justify-center group border border-transparent hover:border-gray-500 transition-all">
      {stream && isVideoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={cn(
            "w-full h-full object-cover",
            isLocal && "scale-x-[-1]"
          )}
        />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold uppercase shadow-lg">
            {name ? name.charAt(0) : '?'}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md">
        <span className="text-sm font-medium">{name} {isLocal && '(You)'}</span>
        {isMuted && <MicOff className="w-3.5 h-3.5 text-red-500" />}
      </div>
    </div>
  );
};

export default VideoTile;
