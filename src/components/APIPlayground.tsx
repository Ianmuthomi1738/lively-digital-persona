
import React, { useState, useRef, useEffect } from 'react';
import { useAvatarSDK } from '../api/useAvatarSDK';
import { VoiceEmotion } from '../api/AvatarSDK';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AvatarDemoCard } from './APIPlayground/AvatarDemoCard';
import { EmotionDemoCard } from './APIPlayground/EmotionDemoCard';
import { ConversationHistoryCard } from './APIPlayground/ConversationHistoryCard';
import { SpeechControlsCard } from './APIPlayground/SpeechControlsCard';
import { ConfigurationCard } from './APIPlayground/ConfigurationCard';
import { CodeGeneratorCard } from './APIPlayground/CodeGeneratorCard';

export const APIPlayground: React.FC = () => {
  const avatarRef = useRef<any>(null);
  const [textToSpeak, setTextToSpeak] = useState("Hello! I'm your AI assistant. How can I help you today?");
  const [selectedExpression, setSelectedExpression] = useState<'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'>('neutral');
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState('natural');
  const [selectedEmotion, setSelectedEmotion] = useState<VoiceEmotion['type']>('neutral');
  const [emotionIntensity, setEmotionIntensity] = useState(0.7);
  const [generatedCode, setGeneratedCode] = useState('');

  const config = {
    voiceStyle: selectedVoiceStyle as any,
    initialExpression: selectedExpression,
    theme: 'purple' as any
  };

  const eventHandlers = {
    onSpeakStart: () => toast.info('Avatar started speaking'),
    onSpeakEnd: () => toast.success('Avatar finished speaking'),
    onListenStart: () => toast.info('Avatar started listening'),
    onListenEnd: () => toast.success('Avatar finished listening'),
    onTranscriptReceived: (transcript: string) => toast.success(`Heard: "${transcript}"`),
    onExpressionChange: (expression: string) => toast.info(`Expression changed to: ${expression}`),
    onError: (error: Error) => toast.error(`Error: ${error.message}`),
    onInterrupted: () => toast.warning('Speech was interrupted')
  };

  const {
    connectAvatar,
    speak,
    listen,
    setExpression,
    clearConversation,
    interrupt,
    isReady,
    isSpeaking,
    isListening,
    conversation,
    canInterrupt
  } = useAvatarSDK(config, eventHandlers);

  useEffect(() => {
    if (avatarRef.current) {
      connectAvatar(avatarRef.current);
    }
  }, [connectAvatar]);

  useEffect(() => {
    // Generate code example based on current settings
    const code = `import { useAvatarSDK } from './api/useAvatarSDK';
import { Avatar } from './components/Avatar/Avatar';

const config = {
  voiceStyle: '${selectedVoiceStyle}',
  initialExpression: '${selectedExpression}',
  theme: 'purple'
};

const eventHandlers = {
  onSpeakStart: () => console.log('Speaking started'),
  onTranscriptReceived: (transcript) => console.log('Heard:', transcript),
  onInterrupted: () => console.log('Speech interrupted')
};

function MyApp() {
  const { 
    connectAvatar, 
    speak, 
    listen, 
    setExpression, 
    interrupt, 
    canInterrupt 
  } = useAvatarSDK(config, eventHandlers);
  const avatarRef = useRef();

  useEffect(() => {
    if (avatarRef.current) {
      connectAvatar(avatarRef.current);
    }
  }, [connectAvatar]);

  const speakWithEmotion = async () => {
    await speak("${textToSpeak}", {
      emotion: {
        type: '${selectedEmotion}',
        intensity: ${emotionIntensity}
      }
    });
  };

  return (
    <div>
      <Avatar ref={avatarRef} />
      <button onClick={speakWithEmotion}>
        Speak with Emotion
      </button>
      <button 
        onClick={interrupt} 
        disabled={!canInterrupt}
      >
        Interrupt
      </button>
    </div>
  );
}`;
    setGeneratedCode(code);
  }, [selectedVoiceStyle, selectedExpression, textToSpeak, selectedEmotion, emotionIntensity]);

  const handleSpeak = async () => {
    if (!textToSpeak.trim()) {
      toast.error('Please enter some text to speak');
      return;
    }
    
    try {
      await speak(textToSpeak, {
        emotion: {
          type: selectedEmotion,
          intensity: emotionIntensity
        }
      });
    } catch (error) {
      console.error('Speak error:', error);
    }
  };

  const handleListen = async () => {
    try {
      await listen();
    } catch (error) {
      console.error('Listen error:', error);
    }
  };

  const handleExpressionChange = (expression: string) => {
    const expr = expression as 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
    setSelectedExpression(expr);
    setExpression(expr);
  };

  const handleInterrupt = () => {
    interrupt();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('Code copied to clipboard!');
  };

  const handleEmotionSpeak = (text: string, emotion: VoiceEmotion) => {
    speak(text, { emotion });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Enhanced Avatar API Playground</h1>
        <p className="text-gray-600">Test emotional voice synthesis, interruption, and more advanced features</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Avatar Demo */}
        <div className="space-y-6">
          <AvatarDemoCard
            avatarRef={avatarRef}
            selectedExpression={selectedExpression}
            isReady={isReady}
            isSpeaking={isSpeaking}
            isListening={isListening}
            canInterrupt={canInterrupt}
            onInterrupt={handleInterrupt}
          />

          <EmotionDemoCard
            onSpeak={handleEmotionSpeak}
            isReady={isReady}
            isSpeaking={isSpeaking}
            isListening={isListening}
          />

          <ConversationHistoryCard
            conversation={conversation}
            onClearConversation={clearConversation}
          />
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <Tabs defaultValue="controls">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="code">Generated Code</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-4">
              <SpeechControlsCard
                textToSpeak={textToSpeak}
                setTextToSpeak={setTextToSpeak}
                selectedEmotion={selectedEmotion}
                setSelectedEmotion={setSelectedEmotion}
                emotionIntensity={emotionIntensity}
                setEmotionIntensity={setEmotionIntensity}
                onSpeak={handleSpeak}
                onListen={handleListen}
                isReady={isReady}
                isSpeaking={isSpeaking}
                isListening={isListening}
              />

              <ConfigurationCard
                selectedExpression={selectedExpression}
                onExpressionChange={handleExpressionChange}
                selectedVoiceStyle={selectedVoiceStyle}
                setSelectedVoiceStyle={setSelectedVoiceStyle}
              />
            </TabsContent>

            <TabsContent value="code">
              <CodeGeneratorCard
                generatedCode={generatedCode}
                onCopyCode={copyCode}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
