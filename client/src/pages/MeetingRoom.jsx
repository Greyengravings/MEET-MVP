import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMeeting } from '../hooks/useMeeting';
import VideoTile from '../components/VideoTile';
import Controls from '../components/Controls';
import Chat from '../components/Chat';
import { Copy, Check, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { cn } from '../lib/utils';

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);

  const meeting = useMeeting(roomId, isJoined ? userName : null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isJoined) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-dark-bg p-8 gap-12">
        <div className="flex-1 max-w-2xl w-full">
           <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-700">
              {meeting.localStream ? (
                <video
                  ref={(el) => el && (el.srcObject = meeting.localStream)}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Camera is starting...</span>
                </div>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                 <button 
                   onClick={meeting.toggleMic}
                   className={cn("w-12 h-12 rounded-full flex items-center justify-center border transition-all", meeting.isMicOn ? "border-gray-500 hover:bg-white/10" : "bg-red-500 border-red-500")}
                 >
                   {meeting.isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                 </button>
                 <button 
                   onClick={meeting.toggleCam}
                   className={cn("w-12 h-12 rounded-full flex items-center justify-center border transition-all", meeting.isCamOn ? "border-gray-500 hover:bg-white/10" : "bg-red-500 border-red-500")}
                 >
                   {meeting.isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                 </button>
              </div>
           </div>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">Ready to join?</h2>
            <p className="text-gray-400 mt-2">Meeting ID: {roomId}</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">What's your name?</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 mt-1 outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && userName.trim() && setIsJoined(true)}
              />
            </div>
            <button
              disabled={!userName.trim()}
              onClick={() => setIsJoined(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Join now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg relative">
      <div className="flex-1 flex flex-col relative">
        <div className={showChat ? "w-[calc(100%-24rem)]" : "w-full"}>
          <div className="video-grid">
            <VideoTile
              stream={meeting.localStream}
              name={userName}
              isLocal={true}
              isMuted={!meeting.isMicOn}
            />
            {meeting.peers.map((peer) => (
              <VideoTile
                key={peer.socketId}
                stream={peer.stream}
                name={peer.name}
                isLocal={false}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-24 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-700">
           <span className="text-sm font-medium">Meeting link</span>
           <button 
             onClick={handleCopyLink}
             className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
           >
             {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
           </button>
        </div>

        <Controls
          isMicOn={meeting.isMicOn}
          toggleMic={meeting.toggleMic}
          isCamOn={meeting.isCamOn}
          toggleCam={meeting.toggleCam}
          isScreenSharing={meeting.isScreenSharing}
          toggleScreenShare={meeting.toggleScreenShare}
          onLeave={() => navigate('/')}
          participantCount={meeting.peers.length + 1}
          onToggleChat={() => setShowChat(!showChat)}
          showChat={showChat}
        />
      </div>

      {showChat && (
        <Chat
          messages={meeting.messages}
          onSendMessage={meeting.sendMessage}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default MeetingRoom;
