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
import { Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';
import { cn } from '../lib/utils';

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [sidebarType, setSidebarType] = useState(null); // 'chat', 'people', or null
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // 'adjust-view', 'settings', 'troubleshoot'
  const [currentLayout, setCurrentLayout] = useState('auto');

  const meeting = useMeeting(roomId, isJoined ? userName : null);

  useEffect(() => {
    const savedName = localStorage.getItem('meet_name');
    if (savedName) setUserName(savedName);
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

  const handleMenuAction = (actionId) => {
    switch (actionId) {
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
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-black p-6 lg:p-24 gap-12">
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
                  <span className="text-white/40 font-medium">Camera is off</span>
                </div>
              )}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                 <button
                   onClick={meeting.toggleMic}
                   className={cn(
                     "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                     meeting.isMicOn ? "border-white/20 hover:bg-white/10 text-white" : "bg-red-500 border-red-500 text-white"
                   )}
                 >
                   {meeting.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                 </button>
                 <button
                   onClick={meeting.toggleCam}
                   className={cn(
                     "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                     meeting.isCamOn ? "border-white/20 hover:bg-white/10 text-white" : "bg-red-500 border-red-500 text-white"
                   )}
                 >
                   {meeting.isCamOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                 </button>
              </div>
           </div>
        </div>

        <div className="w-full max-w-md space-y-10 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-4xl font-normal text-white">Ready to join?</h2>
          </div>
          <div className="space-y-6">
            <input
              type="text"
              autoFocus
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-transparent border-b border-white/20 focus:border-accent-purple py-3 outline-none transition-all text-xl placeholder-white/40 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <button
                disabled={!userName.trim()}
                onClick={handleJoin}
                className="flex-1 bg-accent-purple hover:bg-accent-purpleHover disabled:bg-dark-surface disabled:text-white/20 text-white font-medium py-3 rounded-full transition-all text-md shadow-lg"
              >
                Join now
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
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarType ? "md:mr-[360px]" : ""
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
            sidebarOpen={!!sidebarType}
            layout={currentLayout}
          />
        </div>

        {/* Sidebar Container */}
        <div className={cn(
          "w-full md:w-[360px] h-full bg-dark-bg fixed md:absolute right-0 top-0 z-40 shadow-2xl flex flex-col transition-all duration-300 ease-in-out border-l border-white/5",
          sidebarType ? "translate-x-0" : "translate-x-full"
        )}>
          {sidebarType === 'chat' && (
            <Chat
              messages={meeting.messages}
              onSendMessage={meeting.sendMessage}
              onClose={() => setSidebarType(null)}
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
    </div>
  );
};

export default MeetingRoom;
