import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'https://meet-server-lsp0.onrender.com';

export const useMeeting = (roomId, userName) => {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]); // Array of { socketId, name, stream, isMicOn, isCamOn, isHandRaised }
  const [messages, setMessages] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

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
          isCamOn: user.isCamOn,
          isHandRaised: user.isHandRaised || false
        }]);
      });
    });

    socketRef.current.on('user-joined', async ({ socketId, name, isMicOn, isCamOn, isHandRaised }) => {
      const pc = createPeerConnection(socketId, name);
      peersRef.current[socketId] = pc;
      setPeers(prev => [...prev, {
        socketId,
        name,
        stream: null,
        isMicOn,
        isCamOn,
        isHandRaised: isHandRaised || false
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

    socketRef.current.on('user-hand-updated', ({ socketId, isHandRaised, name }) => {
      setPeers(prev => prev.map(p => {
        if (p.socketId === socketId) {
          return { ...p, isHandRaised };
        }
        return p;
      }));
      if (isHandRaised) {
        addNotification({ type: 'hand-raise', name });
      }
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
      addNotification({ type: 'chat', name: message.sender, text: message.text });
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
  }, [roomId, userName, createPeerConnection, addNotification]);

  // Sync media changes to socket
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('update-media-status', { roomId, isMicOn, isCamOn });
    }
  }, [isMicOn, isCamOn, roomId]);

  // Sync hand status to socket
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('update-hand-status', { roomId, isHandRaised });
    }
  }, [isHandRaised, roomId]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCamOn;
      }
      setIsCamOn(!isCamOn);
    }
  };

  const toggleHandRaised = () => {
    setIsHandRaised(!isHandRaised);
  };

  const toggleScreenShare = async () => {
    if (!navigator.mediaDevices.getDisplayMedia) {
      alert('Screen sharing is not supported by this browser or device.');
      return;
    }

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
      screenStreamRef.current = null;
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
    isHandRaised,
    isScreenSharing,
    notifications,
    toggleMic,
    toggleCam,
    toggleHandRaised,
    toggleScreenShare,
    sendMessage
  };
};
