
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from './Avatar/Avatar';
import { useAvatarSDK } from '../api/useAvatarSDK';
import { VoiceEmotion } from '../api/AvatarSDK';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Mic, Settings, MessageSquare, Code, Copy, StopCircle, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

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

  // Quick emotion demos
  const emotionDemos = [
    { emotion: 'happy' as const, text: "That's absolutely wonderful! I'm so excited to help you today!", icon: "😊" },
    { emotion: 'laugh' as const, text: "That joke was hilarious! You really made my day!", icon: "😂" },
    { emotion: 'whisper' as const, text: "I'll tell you a secret... this voice technology is amazing", icon: "🤫" },
    { emotion: 'excited' as const, text: "This is incredible! The possibilities are endless!", icon: "🎉" },
    { emotion: 'sad' as const, text: "I understand how you feel... that must be difficult", icon: "😢" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Enhanced Avatar API Playground</h1>
        <p className="text-gray-600">Test emotional voice synthesis, interruption, and more advanced features</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Avatar Demo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Live Demo
                </div>
                {canInterrupt && (
                  <Button
                    onClick={handleInterrupt}
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <StopCircle className="w-4 h-4" />
                    Interrupt
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl p-6">
                  <Avatar 
                    ref={avatarRef}
                    expression={selectedExpression}
                    onInterrupted={() => toast.warning('Avatar was interrupted')}
                  />
                </div>
                
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <Badge variant={isReady ? "default" : "secondary"}>
                    {isReady ? "Ready" : "Initializing"}
                  </Badge>
                  {isSpeaking && <Badge variant="destructive">Speaking</Badge>}
                  {isListening && <Badge variant="default">Listening</Badge>}
                  {canInterrupt && <Badge variant="outline">Interruptible</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Emotion Demos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Quick Emotion Demos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {emotionDemos.map((demo, index) => (
                  <Button
                    key={index}
                    onClick={() => speak(demo.text, { emotion: { type: demo.emotion, intensity: 0.8 } })}
                    disabled={!isReady || isSpeaking || isListening}
                    variant="outline"
                    className="justify-start text-left h-auto p-3"
                  >
                    <span className="text-lg mr-2">{demo.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium capitalize">{demo.emotion}</div>
                      <div className="text-sm text-gray-500 truncate">{demo.text}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {conversation.length === 0 ? (
                  <p className="text-gray-500 text-center">No conversation yet</p>
                ) : (
                  conversation.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded text-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      <span className="font-semibold">{msg.role === 'user' ? 'You' : 'Avatar'}:</span> {msg.text}
                    </div>
                  ))
                )}
              </div>
              {conversation.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearConversation}
                  className="mt-2 w-full"
                >
                  Clear History
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <Tabs defaultValue="controls">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="code">Generated Code</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Emotional Speech Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Text to Speak</label>
                    <Textarea
                      value={textToSpeak}
                      onChange={(e) => setTextToSpeak(e.target.value)}
                      placeholder="Enter text for the avatar to speak..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Emotion</label>
                      <Select value={selectedEmotion} onValueChange={(value) => setSelectedEmotion(value as VoiceEmotion['type'])}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="happy">Happy</SelectItem>
                          <SelectItem value="excited">Excited</SelectItem>
                          <SelectItem value="sad">Sad</SelectItem>
                          <SelectItem value="whisper">Whisper</SelectItem>
                          <SelectItem value="laugh">Laugh</SelectItem>
                          <SelectItem value="angry">Angry</SelectItem>
                          <SelectItem value="surprised">Surprised</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Intensity ({emotionIntensity})</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={emotionIntensity}
                        onChange={(e) => setEmotionIntensity(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSpeak}
                      disabled={!isReady || isSpeaking || !textToSpeak.trim()}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Speak
                    </Button>
                    
                    <Button 
                      onClick={handleListen}
                      disabled={!isReady || isListening || isSpeaking}
                      variant="outline"
                      className="flex-1"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expression</label>
                    <Select value={selectedExpression} onValueChange={handleExpressionChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="happy">Happy</SelectItem>
                        <SelectItem value="sad">Sad</SelectItem>
                        <SelectItem value="thinking">Thinking</SelectItem>
                        <SelectItem value="surprised">Surprised</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Voice Style</label>
                    <Select value={selectedVoiceStyle} onValueChange={setSelectedVoiceStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="expressive">Expressive</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="energetic">Energetic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Generated Code
                    </div>
                    <Button variant="outline" size="sm" onClick={copyCode}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
                    <code>{generatedCode}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
