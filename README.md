
# Interactive Female Avatar Component

A fully functional, interactive female avatar component built with React, TypeScript, and modern web APIs. Features realistic facial expressions, voice synthesis, speech recognition, and AI chatbot integration.

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
- Modern browser with Web Speech API support
- Microphone access for speech recognition

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
      // Process the transcript and respond
    });
  };

  return (
    <div>
      <Avatar 
        ref={avatarRef}
        expression="happy"
        onSpeakingStateChange={(isSpeaking) => console.log('Speaking:', isSpeaking)}
      />
      <button onClick={handleSpeak}>Speak</button>
      <button onClick={handleListen}>Listen</button>
    </div>
  );
};
```

### Avatar API Reference

```typescript
interface AvatarAPI {
  // Speak text with lip-sync animation
  speak(text: string): Promise<void>;
  
  // Listen for user speech and return transcript
  listen(onResult: (transcript: string) => void): Promise<void>;
  
  // Change facial expression
  setExpression(name: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'): void;
}
```

### Expression Types

- **neutral** - Default relaxed expression
- **happy** - Smiling with raised cheeks
- **sad** - Downturned mouth with raised eyebrows
- **thinking** - Slightly raised eyebrow with small mouth
- **surprised** - Wide eyes with open mouth

## 🏗️ Architecture

### Component Structure
```
src/components/Avatar/
├── Avatar.tsx              # Main avatar component
├── AvatarAPI.ts           # TypeScript interface
├── AvatarFace.tsx         # Detailed facial features
└── hooks/
    ├── useAnimations.ts   # Animation state management
    ├── useSpeechSynthesis.ts  # Text-to-speech logic
    └── useSpeechRecognition.ts # Speech recognition logic
```

### Key Technologies
- **React 18** with TypeScript for component architecture
- **Tailwind CSS** for styling and animations
- **Web Speech API** for voice synthesis and recognition
- **Custom hooks** for state management and side effects
- **CSS animations** for smooth 60fps performance

## 🎨 Customization

### Styling
The avatar uses Tailwind CSS classes and can be customized by:
- Modifying color schemes in `tailwind.config.ts`
- Adjusting facial features in `AvatarFace.tsx`
- Customizing animations in `useAnimations.ts`

### Voice Settings
Configure voice parameters in `useSpeechSynthesis.ts`:
```typescript
utterance.rate = 0.9;    // Speech speed (0.1-10)
utterance.pitch = 1.1;   // Voice pitch (0-2)
utterance.volume = 0.8;  // Volume level (0-1)
```

### Expression Timing
Adjust animation timing in `useAnimations.ts`:
```typescript
const delay = Math.random() * 4000 + 3000; // Blink every 3-7 seconds
```

## 🔧 Browser Support

### Speech Synthesis
- ✅ Chrome/Edge 33+
- ✅ Firefox 49+
- ✅ Safari 7+

### Speech Recognition
- ✅ Chrome/Edge 25+
- ⚠️ Firefox (requires flag)
- ❌ Safari (not supported)

### Fallbacks
- Voice synthesis gracefully degrades to text display
- Speech recognition shows manual input option
- Animations work in all modern browsers

## 🐛 Troubleshooting

### Common Issues

**Speech recognition not working:**
- Ensure microphone permissions are granted
- Check browser compatibility
- Test in Chrome/Edge for best support

**Voice sounds robotic:**
- Install additional system voices
- Try different voice selection in the code
- Adjust speech rate and pitch parameters

**Animations stuttering:**
- Reduce CSS transition complexity
- Check browser hardware acceleration
- Monitor performance with dev tools

### Browser Permissions
The app requires microphone access for speech recognition. Users will see a permission prompt on first use.

## 📱 Mobile Support

The avatar is responsive and works on mobile devices, though speech recognition support varies:
- **iOS Safari**: Text-to-speech works, speech recognition limited
- **Android Chrome**: Full functionality supported
- **Touch interactions**: All controls work with touch

## 🚀 Deployment

For production deployment:

1. **Build the project:**
```bash
npm run build
```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure HTTPS** (required for microphone access)

4. **Test speech features** in the deployed environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test across different browsers
5. Submit a pull request

## 📄 License

MIT License - feel free to use this avatar component in your projects!

## 🔮 Future Enhancements

- **3D avatar option** using Three.js/React Three Fiber
- **Emotion recognition** from user's voice tone
- **Custom voice training** for personalized speech
- **WebRTC integration** for real-time video chat
- **Multi-language support** with voice localization
- **Hand gestures** and body language animations

---

**Ready to bring your AI assistant to life?** 🎭✨

Start the development server and click "Start Conversation" to see the avatar in action!
