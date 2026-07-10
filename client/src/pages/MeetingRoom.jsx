import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMeeting } from '../hooks/useMeeting';
import VideoGrid from '../components/VideoGrid';
import Controls from '../components/Controls';
import Chat from '../components/Chat';
import ParticipantsPanel from '../components/ParticipantsPanel';
import MeetingNotification from '../components/MeetingNotification';
import MeetingDetailsPopup from '../components/MeetingDetailsPopup';
import MeetingInfoBar from '../components/MeetingInfoBar';
import AdjustViewPanel from '../components/AdjustViewPanel';
import MeetingSettings from '../components/MeetingSettings';
import TroubleshootingPanel from '../components/TroubleshootingPanel';
import ComingSoonToast from '../components/ComingSoonToast';
import { Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';
import { cn } from '../lib/utils';

const BytesMeetLogo = ({ className }) => (
  <div className={cn("flex items-center gap-0.5 font-bold text-xl tracking-tighter select-none", className)}>
    <span className="text-white">BYTES</span>
    <span className="text-accent-purple">MEET</span>
  </div>
);

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [sidebarType, setSidebarType] = useState(null); // 'chat', 'people', or null
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // 'adjust-view', 'settings', 'troubleshoot'
  const [currentLayout, setCurrentLayout] = useState('auto');
  const [comingSoonFeature, setComingSoonFeature] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const meeting = useMeeting(roomId, isJoined ? userName : null);

  useEffect(() => {
    const savedName = localStorage.getItem('meet_name');
    if (savedName) setUserName(savedName);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleJoin = () => {
    if (userName.trim()) {
      localStorage.setItem('meet_name', userName.trim());
      setIsJoined(true);
      setShowDetailsPopup(true);
    }
  };

  const toggleSidebar = (type) => {
    setSidebarType(prev => prev === type ? null : type);
  };

  const handleMenuAction = (actionId, featureName) => {
    switch (actionId) {
      case 'coming-soon':
        setComingSoonFeature(featureName);
        break;
      case 'adjust-view':
        setActivePanel('adjust-view');
        break;
      case 'fullscreen':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        break;
      case 'pip':
        const videos = document.querySelectorAll('video');
        const activeVideo = Array.from(videos).find(v => v.srcObject && !v.muted) || videos[0];
        if (activeVideo && document.pictureInPictureEnabled) {
          activeVideo.requestPictureInPicture().catch(console.error);
        } else {
          alert('Picture-in-picture is not supported by this browser.');
        }
        break;
      case 'chat':
        toggleSidebar('chat');
        break;
      case 'settings':
        setActivePanel('settings');
        break;
      case 'troubleshoot':
        setActivePanel('troubleshoot');
        break;
      case 'show-info':
        setShowDetailsPopup(true);
        break;
      default:
        console.log('Action not implemented:', actionId);
    }
  };

  if (!isJoined) {
    return (
      <div className="flex flex-col min-h-screen min-h-[100dvh] bg-black text-white overflow-y-auto">
        <header className="h-16 px-6 flex items-center border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <BytesMeetLogo />
        </header>

        <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 lg:p-24 gap-12 max-w-7xl mx-auto w-full">
          <div className="flex-1 max-w-2xl w-full">
            <div className="relative aspect-video bg-dark-surface rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                {meeting.localStream && meeting.isCamOn ? (
                  <video
                    ref={(el) => el && (el.srcObject = meeting.localStream)}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-dark-surface">
                    <div className="w-24 h-24 bg-accent-purple rounded-full flex items-center justify-center text-4xl font-bold uppercase text-white shadow-xl">
                      {userName ? userName.charAt(0) : '?'}
                    </div>
                    <span className="text-white/40 font-medium text-sm">Camera is off</span>
                  </div>
                )}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <button
                    onClick={meeting.toggleMic}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                      meeting.isMicOn ? "border-white/20 hover:bg-white/10 text-white" : "bg-red-500 border-red-500 text-white"
                    )}
                    aria-label={meeting.isMicOn ? "Mute" : "Unmute"}
                  >
                    {meeting.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={meeting.toggleCam}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                      meeting.isCamOn ? "border-white/20 hover:bg-white/10 text-white" : "bg-red-500 border-red-500 text-white"
                    )}
                    aria-label={meeting.isCamOn ? "Turn off camera" : "Turn on camera"}
                  >
                    {meeting.isCamOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>
                </div>
            </div>
          </div>

          <div className="w-full max-w-md space-y-8 text-center md:text-left pb-12 md:pb-0">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Ready to join?</h2>
              <p className="text-white/50 text-sm">Ensure your camera and microphone are working correctly.</p>
            </div>
            <div className="space-y-6">
              <input
                type="text"
                autoFocus
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent border-b border-white/20 focus:border-accent-purple py-3 outline-none transition-all text-xl placeholder-white/20 text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
              <button
                disabled={!userName.trim()}
                onClick={handleJoin}
                className="w-full bg-accent-purple hover:bg-accent-purpleHover disabled:bg-dark-surface disabled:text-white/20 text-white font-bold py-4 rounded-xl transition-all text-lg shadow-xl shadow-accent-purple/10"
              >
                Join meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const participantsCount = meeting.peers.length + 1;
  const raisedHands = [...meeting.peers, { name: userName, isHandRaised: meeting.isHandRaised }].filter(p => p.isHandRaised);

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-black overflow-hidden select-none">
      <div className="flex-1 relative flex overflow-hidden">
        <MeetingInfoBar
          roomId={roomId}
          raisedHands={raisedHands}
          onInfoClick={() => setShowDetailsPopup(true)}
        />

        <div className={cn(
          "flex-1 flex flex-col transition-none", // Fixed stretching: remove transition-all from parent
          sidebarType && !isMobile ? "md:mr-[360px]" : ""
        )}>
          <VideoGrid
            participants={meeting.peers}
            localUser={{
              name: userName,
              localStream: meeting.localStream,
              isMicOn: meeting.isMicOn,
              isCamOn: meeting.isCamOn,
              isHandRaised: meeting.isHandRaised,
              isScreenSharing: meeting.isScreenSharing
            }}
            sidebarOpen={!!sidebarType && !isMobile}
            layout={currentLayout}
          />
        </div>

        {/* Sidebar Container - FIXED stretching animation */}
        <div className={cn(
          "h-full bg-dark-bg z-40 flex flex-col border-l border-white/5 transition-all duration-250 ease-out shadow-2xl",
          isMobile
            ? "fixed inset-0 w-full"
            : "absolute right-0 top-0 w-[360px]",
          sidebarType
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none"
        )}>
          {sidebarType === 'chat' && (
            <Chat
              messages={meeting.messages}
              onSendMessage={meeting.sendMessage}
              onClose={() => setSidebarType(null)}
              isMobile={isMobile}
            />
          )}
          {sidebarType === 'people' && (
            <ParticipantsPanel
              participants={meeting.peers}
              localUser={{
                name: userName,
                isMicOn: meeting.isMicOn,
                isCamOn: meeting.isCamOn,
                isHandRaised: meeting.isHandRaised
              }}
              onClose={() => setSidebarType(null)}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>

      <MeetingNotification
        notifications={sidebarType === 'chat' ? meeting.notifications.filter(n => n.type !== 'chat') : meeting.notifications}
      />

      <Controls
        isMicOn={meeting.isMicOn}
        toggleMic={meeting.toggleMic}
        isCamOn={meeting.isCamOn}
        toggleCam={meeting.toggleCam}
        isHandRaised={meeting.isHandRaised}
        toggleHandRaised={meeting.toggleHandRaised}
        isScreenSharing={meeting.isScreenSharing}
        toggleScreenShare={meeting.toggleScreenShare}
        onLeave={() => navigate('/')}
        participantCount={participantsCount}
        onToggleChat={() => toggleSidebar('chat')}
        showChat={sidebarType === 'chat'}
        onToggleParticipants={() => toggleSidebar('people')}
        showParticipants={sidebarType === 'people'}
        roomId={roomId}
        onMenuAction={handleMenuAction}
      />

      <MeetingDetailsPopup
        roomId={roomId}
        isVisible={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
      />

      {activePanel === 'adjust-view' && (
        <AdjustViewPanel
          currentLayout={currentLayout}
          onLayoutChange={(l) => { setCurrentLayout(l); setActivePanel(null); }}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === 'settings' && (
        <MeetingSettings onClose={() => setActivePanel(null)} />
      )}

      {activePanel === 'troubleshoot' && (
        <TroubleshootingPanel
          participantCount={participantsCount}
          onClose={() => setActivePanel(null)}
        />
      )}

      {comingSoonFeature && (
        <ComingSoonToast
          featureName={comingSoonFeature}
          onClose={() => setComingSoonFeature(null)}
        />
      )}
    </div>
  );
};

export default MeetingRoom;
