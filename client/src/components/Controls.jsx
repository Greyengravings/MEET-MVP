import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, 
  MessageSquare, Users, PhoneOff, Info, MoreVertical,
  Hand, Grid
} from 'lucide-react';
import { cn } from '../lib/utils';
import MoreOptionsMenu from './MoreOptionsMenu';
import MobileMoreSheet from './MobileMoreSheet';

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

  const handleMenuAction = (actionId, featureName) => {
    setShowMoreMenu(false);

    // Handle actions that are directly in Controls but also in More menu on mobile
    if (actionId === 'chat') onToggleChat();
    else if (actionId === 'people') onToggleParticipants();
    else if (actionId === 'raise-hand') toggleHandRaised();
    else if (actionId === 'screen-share') toggleScreenShare();
    else onMenuAction(actionId, featureName);
  };

  return (
    <div className={cn(
      "bg-black flex items-center justify-between px-4 sm:px-6 z-50 border-t border-white/10 relative",
      isMobile ? "h-24 pb-[env(safe-area-inset-bottom)]" : "h-20"
    )}>
      {/* Left: Meeting Info (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center gap-4 text-sm font-medium text-white/90 min-w-[200px]">
          <span className="hover:bg-white/5 px-2 py-1 rounded cursor-pointer transition-colors" onClick={() => onMenuAction('show-info')}>
            {roomId}
          </span>
        </div>
      )}

      {/* Center: Main Media Controls */}
      <div className={cn(
        "flex items-center gap-3",
        isMobile ? "flex-1 justify-around" : "justify-center"
      )}>
        <button
          onClick={toggleMic}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all border border-white/10",
            isMicOn ? "bg-dark-surface hover:bg-dark-hover" : "bg-red-500 hover:bg-red-600"
          )}
          aria-label={isMicOn ? "Mute" : "Unmute"}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-white" />}
        </button>

        <button
          onClick={toggleCam}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all border border-white/10",
            isCamOn ? "bg-dark-surface hover:bg-dark-hover" : "bg-red-500 hover:bg-red-600"
          )}
          aria-label={isCamOn ? "Turn off camera" : "Turn on camera"}
        >
          {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-white" />}
        </button>

        {!isMobile ? (
          <>
            <button
              onClick={toggleHandRaised}
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
                isHandRaised ? "bg-accent-purple text-white" : "bg-dark-surface hover:bg-dark-hover text-white"
              )}
              title="Raise hand"
            >
              <Hand className={cn("w-5 h-5", isHandRaised && "fill-current")} />
            </button>

            <button
              onClick={toggleScreenShare}
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center transition-all border border-white/10",
                isScreenSharing ? "bg-accent-purple text-white" : "bg-dark-surface hover:bg-dark-hover text-white"
              )}
              title="Present now"
            >
              <ScreenShare className="w-5 h-5" />
            </button>
          </>
        ) : null}

        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center bg-dark-surface hover:bg-dark-hover border border-white/10 text-white transition-all",
            showMoreMenu && "bg-accent-purple border-accent-purple"
          )}
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        <button
          onClick={onLeave}
          className="w-16 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
          aria-label="Leave call"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Right: Side Actions (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center gap-1 min-w-[200px] justify-end">
          <button
            onClick={onToggleParticipants}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all relative",
              showParticipants ? "bg-accent-purple text-white" : "hover:bg-white/5 text-white"
            )}
            aria-label="Open participants"
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
            aria-label="Open chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => onMenuAction('adjust-view')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white"
            aria-label="Adjust view"
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      )}

      {showMoreMenu && (
        isMobile ? (
          <MobileMoreSheet
            onClose={() => setShowMoreMenu(false)}
            onAction={handleMenuAction}
            activeStates={{
              hand: isHandRaised,
              screen: isScreenSharing
            }}
          />
        ) : (
          <MoreOptionsMenu
            onClose={() => setShowMoreMenu(false)}
            onAction={handleMenuAction}
          />
        )
      )}
    </div>
  );
};

export default Controls;
