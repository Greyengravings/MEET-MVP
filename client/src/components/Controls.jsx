import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, 
  MessageSquare, Users, PhoneOff, Info, MoreVertical,
  Hand, Grid
} from 'lucide-react';
import { cn } from '../lib/utils';
import MoreOptionsMenu from './MoreOptionsMenu';

const Controls = ({ 
  isMicOn, toggleMic, 
  isCamOn, toggleCam, 
  isHandRaised, toggleHandRaised,
  isScreenSharing, toggleScreenShare,
  onLeave, 
  participantCount,
  onToggleChat,
  showChat,
  onToggleParticipants,
  showParticipants,
  roomId,
  onMenuAction
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuAction = (actionId) => {
    setShowMoreMenu(false);
    onMenuAction(actionId);
  };

  return (
    <div className="h-20 bg-pure-black flex items-center justify-between px-4 sm:px-6 z-50 border-t border-white/10 relative">
      {/* Left: Meeting Info (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center gap-4 text-sm font-medium text-white/90 min-w-[200px]">
          <span className="hover:bg-white/5 px-2 py-1 rounded cursor-pointer transition-colors" onClick={() => onMenuAction('show-info')}>
            {roomId}
          </span>
        </div>
      )}

      {/* Center: Main Media Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center md:flex-initial">
        <button
          onClick={toggleMic}
          className={cn(
            "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
            isMicOn ? "bg-dark-surface hover:bg-dark-hover" : "bg-red-500 hover:bg-red-600"
          )}
          title={isMicOn ? "Mute" : "Unmute"}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-white" />}
        </button>

        <button
          onClick={toggleCam}
          className={cn(
            "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
            isCamOn ? "bg-dark-surface hover:bg-dark-hover" : "bg-red-500 hover:bg-red-600"
          )}
          title={isCamOn ? "Turn off camera" : "Turn on camera"}
        >
          {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-white" />}
        </button>

        {!isMobile && (
          <>
            <button
              onClick={toggleHandRaised}
              className={cn(
                "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
                isHandRaised ? "bg-accent-purple text-white" : "bg-dark-surface hover:bg-dark-hover text-white"
              )}
              title="Raise hand"
            >
              <Hand className={cn("w-5 h-5", isHandRaised && "fill-current")} />
            </button>

            <button
              onClick={toggleScreenShare}
              className={cn(
                "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
                isScreenSharing ? "bg-accent-purple text-white" : "bg-dark-surface hover:bg-dark-hover text-white"
              )}
              title="Present now"
            >
              <ScreenShare className="w-5 h-5" />
            </button>
          </>
        )}

        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={cn(
            "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-dark-surface hover:bg-dark-hover border border-white/10 text-white transition-all",
            showMoreMenu && "bg-accent-purple border-accent-purple"
          )}
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        <button
          onClick={onLeave}
          className="w-14 h-10 sm:w-16 sm:h-11 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all ml-2"
          title="Leave call"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Right: Side Actions */}
      <div className={cn(
        "flex items-center gap-1 min-w-[200px] justify-end",
        isMobile ? "hidden" : "flex"
      )}>
        <button
          onClick={onToggleParticipants}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all relative",
            showParticipants ? "bg-accent-purple text-white" : "hover:bg-white/5 text-white"
          )}
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-accent-purple text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 font-bold border-2 border-pure-black">
            {participantCount}
          </span>
        </button>

        <button 
          onClick={onToggleChat}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all relative",
            showChat ? "bg-accent-purple text-white" : "hover:bg-white/5 text-white"
          )}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button
          onClick={() => onMenuAction('adjust-view')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white"
        >
          <Grid className="w-5 h-5" />
        </button>
      </div>

      {showMoreMenu && (
        <MoreOptionsMenu
          onClose={() => setShowMoreMenu(false)}
          onAction={handleMenuAction}
          isMobile={isMobile}
          activeStates={{
            mic: isMicOn,
            cam: isCamOn,
            hand: isHandRaised,
            screen: isScreenSharing
          }}
        />
      )}
    </div>
  );
};

export default Controls;
