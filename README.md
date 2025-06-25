
# Interactive Female Avatar Component with WebRTC

A fully functional, interactive female avatar component built with React, TypeScript, and modern web APIs. Features realistic facial expressions, voice synthesis, speech recognition, AI chatbot integration, and **real-time video communication via WebRTC**.

## 🌟 Features

### Visual Design
- **High-fidelity avatar** matching the reference design with blonde hair, facial features, and realistic proportions
- **Smooth animations** including blinking (every 3-7 seconds), eyebrow raises, and subtle head movements
- **Facial expressions** - neutral, happy, sad, thinking, surprised with smooth transitions
- **Lip-sync animation** that matches spoken words with viseme mapping

### Voice Integration
- **Text-to-Speech** using Web Speech API with female voice selection
- **Speech Recognition** for capturing user input with real-time transcription
- **Lip-sync** coordination between speech and mouth animations
- **Voice customization** with rate, pitch, and volume controls

### 🆕 WebRTC Video Communication
- **Real-time video calls** with peer-to-peer connection
- **Low-latency communication** for natural conversations
- **Video/audio controls** with toggle functionality
- **Manual signaling** for connection establishment
- **Cross-platform compatibility** with modern browsers

### AI Chatbot Integration
- **Conversational AI** with contextual responses
- **Real-time chat interface** showing conversation history
- **Expression matching** - avatar expressions change based on conversation tone
- **Interactive demo** with complete conversation flow

### Performance & Compatibility
- **60fps animations** with optimized CSS transitions
- **Responsive design** that works across different screen sizes
- **Modern browser support** with graceful fallbacks
- **Modular architecture** for easy integration and customization

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern browser with Web Speech API and WebRTC support
- Microphone and camera access for full functionality

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd avatar-project
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser to:**
```
http://localhost:8080
```

## 📖 Usage

### Basic Avatar Integration

```typescript
import { Avatar } from './components/Avatar/Avatar';
import { AvatarAPI } from './components/Avatar/AvatarAPI';

const MyComponent = () => {
  const avatarRef = useRef<AvatarAPI>(null);

  const handleSpeak = async () => {
    await avatarRef.current?.speak("Hello! How can I help you today?");
  };

  const handleListen = async () => {
    await avatarRef.current?.listen((transcript) => {
      console.log('User said:', transcript);
    });
  };

  const handleVideoCall = async () => {
    try {
      const offer = await avatarRef.current?.startVideoCall();
      // Share offer with remote peer through signaling server
      console.log('Video call offer:', offer);
    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  };

  return (
    <div>
      <Avatar 
        ref={avatarRef}
        expression="happy"
        enableWebRTC={true}
        onSpeakingStateChange={(isSpeaking) => console.log('Speaking:', isSpeaking)}
      />
      <button onClick={handleSpeak}>Speak</button>
      <button onClick={handleListen}>Listen</button>
      <button onClick={handleVideoCall}>Start Video Call</button>
    </div>
  );
};
```

### WebRTC Video Chat Integration

```typescript
import { WebRTCVideoChat } from './components/Avatar/components/WebRTCVideoChat';

const VideoCallApp = () => {
  const handleOfferCreated = (offer) => {
    // Send offer to remote peer via your signaling mechanism
    sendToRemotePeer('offer', offer);
  };

  const handleAnswerCreated = (answer) => {
    // Send answer to remote peer
    sendToRemotePeer('answer', answer);
  };

  return (
    <WebRTCVideoChat
      config={{
        enableVideo: true,
        enableAudio: true,
        videoConstraints: { width: 1280, height: 720 }
      }}
      onOfferCreated={handleOfferCreated}
      onAnswerCreated={handleAnswerCreated}
    />
  );
};
```

### Avatar API Reference

```typescript
interface AvatarAPI {
  // Speech functionality
  speak(text: string, options?: SpeechOptions): Promise<void>;
  listen(onResult: (transcript: string) => void): Promise<void>;
  setExpression(name: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'): void;
  interrupt(): void;
  canInterrupt: boolean;
  
  // 🆕 WebRTC functionality
  startVideoCall(): Promise<RTCSessionDescriptionInit>;
  answerVideoCall(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
  endVideoCall(): void;
  toggleVideo(): void;
  toggleAudio(): void;
  isVideoCallActive: boolean;
}
```

## 🎥 WebRTC Features

### Supported Functionality
- **Peer-to-peer video calls** with HD quality (up to 1280x720)
- **Real-time audio communication** with echo cancellation
- **Manual signaling** for establishing connections
- **Connection state monitoring** with visual indicators
- **Media controls** for video/audio toggle

### WebRTC Configuration

```typescript
const webRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:your-turn-server.com:3478', username: 'user', credential: 'pass' }
  ],
  enableVideo: true,
  enableAudio: true,
  videoConstraints: { 
    width: { ideal: 1280 }, 
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  },
  audioConstraints: { 
    echoCancellation: true, 
    noiseSuppression: true,
    autoGainControl: true
  }
};
```

### Signaling Process
1. **Initiator** creates an offer using `startVideoCall()`
2. **Offer** is shared with remote peer through signaling mechanism
3. **Remote peer** creates answer using `answerVideoCall(offer)`
4. **Answer** is shared back to initiator
5. **ICE candidates** are exchanged for NAT traversal
6. **Connection established** - video call begins

## 🏗️ Architecture

### Component Structure
```
src/components/Avatar/
├── Avatar.tsx                    # Main avatar component
├── AvatarAPI.ts                 # TypeScript interface with WebRTC
├── AvatarFace.tsx               # Detailed facial features
├── components/
│   ├── WebRTCVideoChat.tsx      # 🆕 Video chat component
│   ├── WebRTCSignaling.tsx      # 🆕 Signaling helper
│   ├── WebRTCDemo.tsx           # 🆕 Complete demo
│   ├── AvatarBackground.tsx     # Background effects
│   └── AvatarControls.tsx       # Control interface
└── hooks/
    ├── useWebRTC.ts             # 🆕 WebRTC connection management
    ├── useAnimations.ts         # Animation state management
    ├── useSpeechSynthesis.ts    # Text-to-speech logic
    └── useSpeechRecognition.ts  # Speech recognition logic
```

### Key Technologies
- **React 18** with TypeScript for component architecture
- **WebRTC APIs** for real-time peer-to-peer communication
- **Tailwind CSS** for styling and animations
- **Web Speech API** for voice synthesis and recognition
- **Custom hooks** for state management and side effects

## 🔧 Browser Support

### WebRTC Support
- ✅ Chrome/Edge 25+
- ✅ Firefox 22+
- ✅ Safari 11+
- ✅ Mobile Chrome/Safari (iOS 14.3+)

### Speech Synthesis
- ✅ Chrome/Edge 33+
- ✅ Firefox 49+
- ✅ Safari 7+

### Speech Recognition
- ✅ Chrome/Edge 25+
- ⚠️ Firefox (requires flag)
- ❌ Safari (not supported)

## 🚀 Deployment & Production

### WebRTC Considerations
- **HTTPS required** for camera/microphone access
- **STUN/TURN servers** needed for production deployments
- **Signaling server** required for peer discovery
- **Firewall configuration** may be needed for enterprise environments

### Recommended TURN Servers
```javascript
// Production-ready TURN configuration
{
  urls: 'turn:global.turn.twilio.com:3478?transport=udp',
  username: 'your-twilio-username',
  credential: 'your-twilio-credential'
}
```

## 🎨 Customization

### WebRTC Video Quality
Configure video constraints in `useWebRTC.ts`:
```typescript
videoConstraints: {
  width: { min: 640, ideal: 1280, max: 1920 },
  height: { min: 480, ideal: 720, max: 1080 },
  frameRate: { min: 15, ideal: 30, max: 60 }
}
```

### Voice Settings
Configure voice parameters in `useSpeechSynthesis.ts`:
```typescript
utterance.rate = 0.85;    // Natural conversational speed
utterance.pitch = 1.0;    // Human-like pitch
utterance.volume = 0.8;   // Comfortable volume
```

## 📱 Mobile Support

The avatar now includes enhanced mobile support:
- **WebRTC works** on iOS Safari 14.3+ and Android Chrome
- **Touch-optimized controls** for video calling
- **Responsive video layout** that adapts to screen size
- **Battery optimization** with automatic quality adjustment

## 🆕 What's New in v2.0

### WebRTC Integration
- **Real-time video calls** with the AI avatar
- **Peer-to-peer communication** with low latency
- **Professional video quality** up to 1080p
- **Cross-platform compatibility** including mobile

### Enhanced Performance
- **Improved mobile stability** with better error handling
- **More natural voice synthesis** with human-like speech patterns
- **Optimized for battery life** on mobile devices
- **Better network handling** for unstable connections

### Developer Experience
- **Comprehensive WebRTC API** with full TypeScript support
- **Modular component architecture** for easy customization
- **Extensive documentation** with practical examples
- **Production-ready signaling** components included

## 🔮 Future Enhancements

- **Screen sharing** integration with avatar overlay
- **AI-powered video effects** and virtual backgrounds
- **Multi-party video calls** with multiple avatars
- **Voice activity detection** for automatic speaking detection
- **Spatial audio** for immersive conversations
- **Recording capabilities** for session playback

---

**Ready to revolutionize video communication with AI?** 🎭✨🎥

Start the development server and experience the future of interactive AI avatars with real-time video calling!
