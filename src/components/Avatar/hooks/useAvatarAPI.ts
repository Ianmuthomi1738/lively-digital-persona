
import { useImperativeHandle } from 'react';
import { AvatarAPI, SpeechOptions, WebRTCCapabilities } from '../AvatarAPI';

export const useAvatarAPI = (
  handleSpeak: (text: string, options?: SpeechOptions) => Promise<void>,
  handleListen: (callback: (transcript: string) => void) => Promise<void>,
  handleSetExpression: (expr: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised') => void,
  handleInterrupt: () => void,
  canInterrupt: boolean,
  webRTCCapabilities?: Partial<WebRTCCapabilities>
) => {
  const createAvatarAPI = (ref: React.Ref<AvatarAPI>) => {
    useImperativeHandle(ref, () => ({
      speak: handleSpeak,
      listen: handleListen,
      setExpression: handleSetExpression,
      interrupt: handleInterrupt,
      canInterrupt,
      // WebRTC capabilities with defaults
      startVideoCall: webRTCCapabilities?.startVideoCall || (async () => {
        throw new Error('WebRTC not enabled');
      }),
      answerVideoCall: webRTCCapabilities?.answerVideoCall || (async () => {
        throw new Error('WebRTC not enabled');
      }),
      endVideoCall: webRTCCapabilities?.endVideoCall || (() => {
        console.warn('WebRTC not enabled');
      }),
      toggleVideo: webRTCCapabilities?.toggleVideo || (() => {
        console.warn('WebRTC not enabled');
      }),
      toggleAudio: webRTCCapabilities?.toggleAudio || (() => {
        console.warn('WebRTC not enabled');
      }),
      isVideoCallActive: webRTCCapabilities?.isVideoCallActive || false
    }));
  };

  return { createAvatarAPI };
};
