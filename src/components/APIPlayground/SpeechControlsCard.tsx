
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Mic } from 'lucide-react';
import { VoiceEmotion } from '../../api/AvatarSDK';

interface SpeechControlsCardProps {
  textToSpeak: string;
  setTextToSpeak: (text: string) => void;
  selectedEmotion: VoiceEmotion['type'];
  setSelectedEmotion: (emotion: VoiceEmotion['type']) => void;
  emotionIntensity: number;
  setEmotionIntensity: (intensity: number) => void;
  onSpeak: () => void;
  onListen: () => void;
  isReady: boolean;
  isSpeaking: boolean;
  isListening: boolean;
}

export const SpeechControlsCard: React.FC<SpeechControlsCardProps> = ({
  textToSpeak,
  setTextToSpeak,
  selectedEmotion,
  setSelectedEmotion,
  emotionIntensity,
  setEmotionIntensity,
  onSpeak,
  onListen,
  isReady,
  isSpeaking,
  isListening
}) => {
  return (
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
            onClick={onSpeak}
            disabled={!isReady || isSpeaking || !textToSpeak.trim()}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Speak
          </Button>
          
          <Button 
            onClick={onListen}
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
  );
};
