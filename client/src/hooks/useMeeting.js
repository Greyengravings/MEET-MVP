import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'https://meet-server-lsp0.onrender.com';

export const useMeeting = (roomId, userName) => {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]); // Array of { socketId, name, stream, isMicOn, isCamOn }
  const [messages, setMessages] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const socketRef = useRef();
  const peersRef = useRef({}); // socketId -> RTCPeerConnection
  const localStreamRef = useRef();
  const screenStreamRef = useRef();

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const createPeerConnection = useCallback((targetSocketId, name) => {
    const pc = new RTCPeerConnection(iceServers);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('signal', {
          targetId: targetSocketId,
          signal: { type: 'candidate', candidate: event.candidate },
        });
      }
    };

    pc.ontrack = (event) => {
      setPeers((prevPeers) => {
        return prevPeers.map(p => {
          if (p.socketId === targetSocketId) {
            return { ...p, stream: event.streams[0] };
          }
          return p;
        });
      });
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    return pc;
  }, []);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localStreamRef.current = stream;
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };
    getMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!userName) return;

    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-room', {
        roomId,
        name: userName,
        isMicOn: isMicOn,
        isCamOn: isCamOn
      });
    });

    socketRef.current.on('all-users', (users) => {
      users.forEach(async (user) => {
        const pc = createPeerConnection(user.socketId, user.name);
        peersRef.current[user.socketId] = pc;
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        socketRef.current.emit('signal', {
          targetId: user.socketId,
          signal: { type: 'offer', offer },
        });

        setPeers(prev => [...prev, {
          socketId: user.socketId,
          name: user.name,
          stream: null,
          isMicOn: user.isMicOn,
          isCamOn: user.isCamOn
        }]);
      });
    });

    socketRef.current.on('user-joined', async ({ socketId, name, isMicOn, isCamOn }) => {
      const pc = createPeerConnection(socketId, name);
      peersRef.current[socketId] = pc;
      setPeers(prev => [...prev, {
        socketId,
        name,
        stream: null,
        isMicOn,
        isCamOn
      }]);
    });

    socketRef.current.on('user-media-updated', ({ socketId, isMicOn, isCamOn }) => {
      setPeers(prev => prev.map(p => {
        if (p.socketId === socketId) {
          return { ...p, isMicOn, isCamOn };
        }
        return p;
      }));
    });

    socketRef.current.on('signal', async ({ senderId, signal }) => {
      const pc = peersRef.current[senderId];
      if (!pc) return;

      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current.emit('signal', {
          targetId: senderId,
          signal: { type: 'answer', answer },
        });
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.answer));
      } else if (signal.type === 'candidate') {
        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    });

    socketRef.current.on('chat-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('user-left', (socketId) => {
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
      }
      setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      Object.values(peersRef.current).forEach(pc => pc.close());
    };
  }, [roomId, userName, createPeerConnection]);

  // Sync media changes to socket
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('update-media-status', { roomId, isMicOn, isCamOn });
    }
  }, [isMicOn, isCamOn, roomId]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCamOn(!isCamOn);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        
        const videoTrack = stream.getVideoTracks()[0];
        
        Object.values(peersRef.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) sender.replaceTrack(videoTrack);
        });

        setLocalStream(new MediaStream([videoTrack, ...localStreamRef.current.getAudioTracks()]));

        videoTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    Object.values(peersRef.current).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
      if (sender) sender.replaceTrack(videoTrack);
    });
    
    setLocalStream(localStreamRef.current);
    setIsScreenSharing(false);
  };

  const sendMessage = (text) => {
    if (socketRef.current && text.trim()) {
      socketRef.current.emit('chat-message', { roomId, text, sender: userName });
    }
  };

  return {
    localStream,
    peers,
    messages,
    isMicOn,
    isCamOn,
    isScreenSharing,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    sendMessage
  };
};
