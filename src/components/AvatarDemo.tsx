
import React, { useState, useRef } from 'react';
import { Avatar } from './Avatar/Avatar';
import { AvatarAPI } from './Avatar/AvatarAPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

export const AvatarDemo: React.FC = () => {
  const avatarRef = useRef<AvatarAPI>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: string, text: string}>>([]);
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'>('neutral');

  // Simple chatbot responses for demo
  const getChatbotResponse = (userInput: string): string => {
    const responses = {
      'hello': "Hello! I'm your AI assistant. How can I help you today?",
      'how are you': "I'm doing wonderful, thank you for asking! How are you feeling?",
      'what is your name': "I'm an AI avatar. You can call me whatever you'd like!",
      'tell me a joke': "Why don't scientists trust atoms? Because they make up everything!",
      'weather': "I don't have access to real weather data, but I hope it's beautiful where you are!",
      'goodbye': "Goodbye! It was lovely talking with you. Have a wonderful day!",
      'thank you': "You're very welcome! I'm here whenever you need me.",
      'default': "That's interesting! Tell me more about that, or ask me anything else you'd like to know."
    };

    const input = userInput.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (input.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const handleListen = async () => {
    if (!avatarRef.current) return;
    
    setIsListening(true);
    setCurrentExpression('thinking');
    
    try {
      await avatarRef.current.listen((transcript: string) => {
        if (transcript.trim()) {
          setConversation(prev => [...prev, { role: 'user', text: transcript }]);
          
          // Get chatbot response
          const response = getChatbotResponse(transcript);
          setConversation(prev => [...prev, { role: 'assistant', text: response }]);
          
          // Speak the response
          handleSpeak(response);
        }
        setIsListening(false);
        setCurrentExpression('neutral');
      });
    } catch (error) {
      console.error('Listen error:', error);
      toast.error('Speech recognition failed. Please try again.');
      setIsListening(false);
      setCurrentExpression('neutral');
    }
  };

  const handleSpeak = async (text: string) => {
    if (!avatarRef.current) return;
    
    setIsSpeaking(true);
    setCurrentExpression('happy');
    
    try {
      await avatarRef.current.speak(text);
    } catch (error) {
      console.error('Speak error:', error);
      toast.error('Speech synthesis failed.');
    } finally {
      setIsSpeaking(false);
      setCurrentExpression('neutral');
    }
  };

  const handleExpressionChange = (expression: typeof currentExpression) => {
    setCurrentExpression(expression);
    avatarRef.current?.setExpression(expression);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto">
      {/* Avatar Section */}
      <div className="flex-1 flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <Avatar 
            ref={avatarRef}
            expression={currentExpression}
            onSpeakingStateChange={setIsSpeaking}
          />
        </div>
        
        {/* Controls */}
        <div className="mt-6 flex gap-4 flex-wrap justify-center">
          <Button
            onClick={handleListen}
            disabled={isListening || isSpeaking}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
            {isListening ? 'Listening...' : 'Start Conversation'}
          </Button>
          
          <Button
            onClick={() => handleSpeak("Hello! I'm your AI assistant. How can I help you today?")}
            disabled={isSpeaking || isListening}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
            {isSpeaking ? 'Speaking...' : 'Test Voice'}
          </Button>
        </div>

        {/* Expression Controls */}
        <div className="mt-4 flex gap-2 flex-wrap justify-center">
          {(['neutral', 'happy', 'sad', 'thinking', 'surprised'] as const).map((expr) => (
            <Button
              key={expr}
              variant={currentExpression === expr ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleExpressionChange(expr)}
              className="capitalize"
            >
              {expr}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 max-w-lg">
        <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {conversation.length === 0 ? (
              <p className="text-white/60 text-center">Click "Start Conversation" to begin talking with the avatar!</p>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-600/20 ml-4 text-blue-100' 
                      : 'bg-purple-600/20 mr-4 text-purple-100'
                  }`}
                >
                  <div className="text-xs text-white/60 mb-1">
                    {msg.role === 'user' ? 'You' : 'Avatar'}
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
