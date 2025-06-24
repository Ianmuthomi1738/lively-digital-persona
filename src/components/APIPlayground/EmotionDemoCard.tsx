
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { VoiceEmotion } from '../../api/AvatarSDK';

interface EmotionDemoCardProps {
  onSpeak: (text: string, emotion: VoiceEmotion) => void;
  isReady: boolean;
  isSpeaking: boolean;
  isListening: boolean;
}

export const EmotionDemoCard: React.FC<EmotionDemoCardProps> = ({
  onSpeak,
  isReady,
  isSpeaking,
  isListening
}) => {
  const emotionDemos = [
    { emotion: 'happy' as const, text: "That's absolutely wonderful! I'm so excited to help you today!", icon: "😊" },
    { emotion: 'laugh' as const, text: "That joke was hilarious! You really made my day!", icon: "😂" },
    { emotion: 'whisper' as const, text: "I'll tell you a secret... this voice technology is amazing", icon: "🤫" },
    { emotion: 'excited' as const, text: "This is incredible! The possibilities are endless!", icon: "🎉" },
    { emotion: 'sad' as const, text: "I understand how you feel... that must be difficult", icon: "😢" }
  ];

  return (
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
              onClick={() => onSpeak(demo.text, { type: demo.emotion, intensity: 0.8 })}
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
  );
};
