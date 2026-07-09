import React from 'react';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, 
  MessageSquare, Users, PhoneOff, Info, MoreVertical,
  Hand, ClosedCaption, Grid
} from 'lucide-react';
import { cn } from '../lib/utils';

const Controls = ({ 
  isMicOn, toggleMic, 
  isCamOn, toggleCam, 
  isScreenSharing, toggleScreenShare,
  onLeave, 
  participantCount,
  onToggleChat,
  showChat,
  roomId
}) => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-20 bg-[#202124] flex items-center justify-between px-4 sm:px-6 z-50">
      {/* Left: Meeting Info */}
      <div className="flex items-center gap-4 text-sm font-medium text-white/90 min-w-[200px] hidden md:flex">
        <span className="tabular-nums">{time}</span>
        <span className="text-white/20">|</span>
        <span className="hover:bg-white/5 px-2 py-1 rounded cursor-pointer truncate max-w-[120px]">
          {roomId}
        </span>
      </div>

      {/* Center: Main Media Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleMic}
          className={cn(
            "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
            isMicOn ? "bg-[#3c4043] hover:bg-[#4a4e51]" : "bg-[#ea4335] hover:bg-[#d93025]"
          )}
          title={isMicOn ? "Mute" : "Unmute"}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-white" />}
        </button>

        <button
          onClick={toggleCam}
          className={cn(
            "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
            isCamOn ? "bg-[#3c4043] hover:bg-[#4a4e51]" : "bg-[#ea4335] hover:bg-[#d93025]"
          )}
          title={isCamOn ? "Turn off camera" : "Turn on camera"}
        >
          {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-white" />}
        </button>

        {/* These would be functional in a full implementation */}
        <button className="hidden sm:flex w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center bg-[#3c4043] hover:bg-[#4a4e51] border border-white/10">
          <ClosedCaption className="w-5 h-5" />
        </button>

        <button className="hidden sm:flex w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center bg-[#3c4043] hover:bg-[#4a4e51] border border-white/10">
          <Hand className="w-5 h-5" />
        </button>

        <button
          onClick={toggleScreenShare}
          className={cn(
            "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
            isScreenSharing ? "bg-[#8ab4f8] text-[#202124]" : "bg-[#3c4043] hover:bg-[#4a4e51]"
          )}
          title="Present now"
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        <button className="hidden sm:flex w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center bg-[#3c4043] hover:bg-[#4a4e51] border border-white/10">
          <MoreVertical className="w-5 h-5" />
        </button>

        <button
          onClick={onLeave}
          className="w-14 h-10 sm:w-16 sm:h-11 bg-[#ea4335] hover:bg-[#d93025] rounded-full flex items-center justify-center transition-all ml-2 sm:ml-4"
          title="Leave call"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Right: Side Actions */}
      <div className="flex items-center gap-1 sm:min-w-[200px] justify-end">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all hidden sm:flex">
          <Info className="w-5 h-5" />
        </button>

        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all relative">
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-[#8ab4f8] text-[#202124] text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 font-bold">
            {participantCount}
          </span>
        </button>

        <button 
          onClick={onToggleChat}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all relative",
            showChat ? "bg-[#8ab4f8] text-[#202124]" : "hover:bg-white/5"
          )}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center hover:bg-white/5 transition-all">
          <Grid className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Controls;
