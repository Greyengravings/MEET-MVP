import React from 'react';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, 
  MessageSquare, Users, PhoneOff, Info, MoreVertical 
} from 'lucide-react';
import { cn } from '../lib/utils';

const Controls = ({ 
  isMicOn, toggleMic, 
  isCamOn, toggleCam, 
  isScreenSharing, toggleScreenShare,
  onLeave, 
  participantCount,
  onToggleChat,
  showChat
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-dark-bg flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4 text-sm font-medium">
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="text-gray-500">|</span>
        <span>Meeting Details</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleMic}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            isMicOn ? "bg-dark-surface hover:bg-dark-hover" : "bg-red-500 hover:bg-red-600"
          )}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleCam}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            isCamOn ? "bg-dark-surface hover:bg-dark-hover" : "bg-red-500 hover:bg-red-600"
          )}
        >
          {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            isScreenSharing ? "bg-blue-600/20 text-blue-400" : "bg-dark-surface hover:bg-dark-hover"
          )}
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        <button
          onClick={onLeave}
          className="w-16 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all ml-4"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-dark-surface transition-all">
          <Info className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-dark-surface transition-all relative">
          <Users className="w-5 h-5" />
          <span className="absolute top-2 right-2 bg-dark-bg border border-gray-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {participantCount}
          </span>
        </button>
        <button 
          onClick={onToggleChat}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all relative",
            showChat ? "bg-blue-600/20 text-blue-400" : "hover:bg-dark-surface"
          )}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-dark-surface transition-all">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Controls;
