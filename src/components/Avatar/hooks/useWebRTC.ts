
import { useRef, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export interface WebRTCConfig {
  iceServers?: RTCIceServer[];
  enableVideo?: boolean;
  enableAudio?: boolean;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
}

export interface WebRTCState {
  isConnected: boolean;
  isConnecting: boolean;
  hasLocalVideo: boolean;
  hasRemoteVideo: boolean;
  connectionState: RTCPeerConnectionState;
}

export const useWebRTC = (config: WebRTCConfig = {}) => {
  const [state, setState] = useState<WebRTCState>({
    isConnected: false,
    isConnecting: false,
    hasLocalVideo: false,
    hasRemoteVideo: false,
    connectionState: 'new'
  });

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const defaultConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    enableVideo: true,
    enableAudio: true,
    audioConstraints: { echoCancellation: true, noiseSuppression: true },
    videoConstraints: { width: 640, height: 480 },
    ...config
  };

  const initializePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection({ iceServers: defaultConfig.iceServers });
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate generated:', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log('Remote track received:', event.track);
      if (remoteStreamRef.current) {
        remoteStreamRef.current.addTrack(event.track);
      } else {
        remoteStreamRef.current = new MediaStream([event.track]);
      }
      
      if (remoteVideoRef.current && remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }

      setState(prev => ({ 
        ...prev, 
        hasRemoteVideo: event.track.kind === 'video' 
      }));
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      setState(prev => ({
        ...prev,
        connectionState: pc.connectionState,
        isConnected: pc.connectionState === 'connected',
        isConnecting: pc.connectionState === 'connecting'
      }));

      if (pc.connectionState === 'connected') {
        toast.success('WebRTC connection established');
      } else if (pc.connectionState === 'failed') {
        toast.error('WebRTC connection failed');
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [defaultConfig.iceServers]);

  const getUserMedia = useCallback(async () => {
    try {
      const constraints = {
        audio: defaultConfig.enableAudio ? defaultConfig.audioConstraints : false,
        video: defaultConfig.enableVideo ? defaultConfig.videoConstraints : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setState(prev => ({
        ...prev,
        hasLocalVideo: defaultConfig.enableVideo && stream.getVideoTracks().length > 0
      }));

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera/microphone');
      throw error;
    }
  }, [defaultConfig.enableAudio, defaultConfig.enableVideo, defaultConfig.audioConstraints, defaultConfig.videoConstraints]);

  const addLocalStream = useCallback(async () => {
    const pc = initializePeerConnection();
    let stream = localStreamRef.current;

    if (!stream) {
      stream = await getUserMedia();
    }

    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    return stream;
  }, [initializePeerConnection, getUserMedia]);

  const createOffer = useCallback(async () => {
    const pc = initializePeerConnection();
    await addLocalStream();

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    return offer;
  }, [initializePeerConnection, addLocalStream]);

  const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    const pc = initializePeerConnection();
    await addLocalStream();

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    return answer;
  }, [initializePeerConnection, addLocalStream]);

  const setRemoteDescription = useCallback(async (answer: RTCSessionDescriptionInit) => {
    const pc = peerConnectionRef.current;
    if (!pc) throw new Error('Peer connection not initialized');

    await pc.setRemoteDescription(answer);
  }, []);

  const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const pc = peerConnectionRef.current;
    if (!pc) throw new Error('Peer connection not initialized');

    await pc.addIceCandidate(candidate);
  }, []);

  const disconnect = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      hasLocalVideo: false,
      hasRemoteVideo: false,
      connectionState: 'closed'
    });

    toast.info('WebRTC connection closed');
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setState(prev => ({ ...prev, hasLocalVideo: videoTrack.enabled }));
      }
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    state,
    localVideoRef,
    remoteVideoRef,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    disconnect,
    toggleVideo,
    toggleAudio,
    getUserMedia
  };
};
