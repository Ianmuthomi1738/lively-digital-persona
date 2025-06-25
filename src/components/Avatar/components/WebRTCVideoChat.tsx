
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useWebRTC, WebRTCConfig } from '../hooks/useWebRTC';

interface WebRTCVideoChatProps {
  config?: WebRTCConfig;
  onOfferCreated?: (offer: RTCSessionDescriptionInit) => void;
  onAnswerCreated?: (answer: RTCSessionDescriptionInit) => void;
  onIceCandidate?: (candidate: RTCIceCandidateInit) => void;
  className?: string;
}

export const WebRTCVideoChat: React.FC<WebRTCVideoChatProps> = ({
  config,
  onOfferCreated,
  onAnswerCreated,
  onIceCandidate,
  className = ''
}) => {
  const {
    state,
    localVideoRef,
    remoteVideoRef,
    createOffer,
    createAnswer,
    disconnect,
    toggleVideo,
    toggleAudio,
    getUserMedia
  } = useWebRTC(config);

  const localVideoElementRef = useRef<HTMLVideoElement>(null);
  const remoteVideoElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoElementRef.current) {
      localVideoRef.current = localVideoElementRef.current;
    }
    if (remoteVideoElementRef.current) {
      remoteVideoRef.current = remoteVideoElementRef.current;
    }
  }, [localVideoRef, remoteVideoRef]);

  const handleStartCall = async () => {
    try {
      await getUserMedia();
      const offer = await createOffer();
      onOfferCreated?.(offer);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const handleAnswerCall = async (offer: RTCSessionDescriptionInit) => {
    try {
      const answer = await createAnswer(offer);
      onAnswerCreated?.(answer);
    } catch (error) {
      console.error('Failed to answer call:', error);
    }
  };

  return (
    <Card className={`w-full max-w-4xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Video Chat</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              state.isConnected ? 'bg-green-500' : 
              state.isConnecting ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            <span className="text-sm text-gray-600">
              {state.connectionState}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative">
            <video
              ref={localVideoElementRef}
              autoPlay
              muted
              playsInline
              className="w-full h-48 bg-gray-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              You
            </div>
            {!state.hasLocalVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Remote Video */}
          <div className="relative">
            <video
              ref={remoteVideoElementRef}
              autoPlay
              playsInline
              className="w-full h-48 bg-gray-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              Remote
            </div>
            {!state.hasRemoteVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleVideo}
            variant={state.hasLocalVideo ? "default" : "destructive"}
            size="sm"
          >
            {state.hasLocalVideo ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>

          <Button
            onClick={toggleAudio}
            variant="default"
            size="sm"
          >
            <Mic className="w-4 h-4" />
          </Button>

          {!state.isConnected && !state.isConnecting && (
            <Button
              onClick={handleStartCall}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Start Call
            </Button>
          )}

          {(state.isConnected || state.isConnecting) && (
            <Button
              onClick={disconnect}
              variant="destructive"
              size="sm"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
