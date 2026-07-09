import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMeeting } from '../hooks/useMeeting';
import VideoTile from '../components/VideoTile';
import Controls from '../components/Controls';
import Chat from '../components/Chat';
import { Copy, Check, Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';
import { cn } from '../lib/utils';

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);

  const meeting = useMeeting(roomId, isJoined ? userName : null);

  useEffect(() => {
    const savedName = localStorage.getItem('meet_name');
    if (savedName) setUserName(savedName);
  }, []);

  const handleJoin = () => {
    if (userName.trim()) {
      localStorage.setItem('meet_name', userName.trim());
      setIsJoined(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isJoined) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#202124] p-6 lg:p-24 gap-12">
        <div className="flex-1 max-w-2xl w-full">
           <div className="relative aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 shadow-2xl">
              {meeting.localStream && meeting.isCamOn ? (
                <video
                  ref={(el) => el && (el.srcObject = meeting.localStream)}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#1a1a1a]">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold uppercase">
                    {userName ? userName.charAt(0) : '?'}
                  </div>
                  <span className="text-gray-400 font-medium">Camera is off</span>
                </div>
              )}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                 <button
                   onClick={meeting.toggleMic}
                   className={cn(
                     "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                     meeting.isMicOn ? "border-white/20 hover:bg-white/10 text-white" : "bg-[#ea4335] border-[#ea4335] text-white"
                   )}
                 >
                   {meeting.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                 </button>
                 <button
                   onClick={meeting.toggleCam}
                   className={cn(
                     "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                     meeting.isCamOn ? "border-white/20 hover:bg-white/10 text-white" : "bg-[#ea4335] border-[#ea4335] text-white"
                   )}
                 >
                   {meeting.isCamOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                 </button>
              </div>
           </div>
        </div>

        <div className="w-full max-w-md space-y-10 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-4xl font-normal text-[#e8eaed]">Ready to join?</h2>
          </div>
          <div className="space-y-6">
            <input
              type="text"
              autoFocus
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-transparent border-b border-[#5f6368] focus:border-blue-400 py-3 outline-none transition-all text-xl placeholder-[#9aa0a6]"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <button
                disabled={!userName.trim()}
                onClick={handleJoin}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-[#3c4043] disabled:text-[#80868b] text-white font-medium py-3 rounded-full transition-all text-md shadow-md"
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
  const getTileFlexBasis = (count) => {
    if (count === 1) return '100%';
    if (count === 2) return '45%';
    if (count <= 4) return '45%';
    if (count <= 6) return '30%';
    return '23%';
  };

  return (
    <div className="flex flex-col h-screen bg-[#202124] overflow-hidden select-none">
      <div className="flex-1 relative flex overflow-hidden">
        <div className={cn(
          "flex-1 flex items-center justify-center transition-all duration-300 ease-in-out",
          showChat ? "md:mr-[360px]" : ""
        )}>
          <div className="video-container">
            <div style={{ flex: `0 1 ${getTileFlexBasis(participantsCount)}`, maxWidth: participantsCount === 1 ? '900px' : 'none' }}>
              <VideoTile
                stream={meeting.localStream}
                name={userName}
                isLocal={true}
                isMuted={!meeting.isMicOn}
                isCamOff={!meeting.isCamOn}
              />
            </div>
            {meeting.peers.map((peer) => (
              <div key={peer.socketId} style={{ flex: `0 1 ${getTileFlexBasis(participantsCount)}` }}>
                <VideoTile
                  stream={peer.stream}
                  name={peer.name}
                  isLocal={false}
                  isMuted={!peer.isMicOn}
                  isCamOff={!peer.isCamOn}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={cn(
          "w-full md:w-[360px] h-full bg-white fixed md:absolute right-0 top-0 z-40 shadow-2xl flex flex-col transition-all duration-300 ease-in-out",
          showChat ? "translate-x-0" : "translate-x-full"
        )}>
          {showChat && (
            <Chat
              messages={meeting.messages}
              onSendMessage={meeting.sendMessage}
              onClose={() => setShowChat(false)}
            />
          )}
        </div>
      </div>

      <Controls
        isMicOn={meeting.isMicOn}
        toggleMic={meeting.toggleMic}
        isCamOn={meeting.isCamOn}
        toggleCam={meeting.toggleCam}
        isScreenSharing={meeting.isScreenSharing}
        toggleScreenShare={meeting.toggleScreenShare}
        onLeave={() => navigate('/')}
        participantCount={participantsCount}
        onToggleChat={() => setShowChat(!showChat)}
        showChat={showChat}
        roomId={roomId}
      />
    </div>
  );
};

export default MeetingRoom;
