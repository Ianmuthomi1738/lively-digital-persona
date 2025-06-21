
import React from 'react';
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface VoiceSettingsProps {
  currentVoice: string;
  onVoiceChange: (voice: string) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ 
  currentVoice, 
  onVoiceChange 
}) => {
  const voiceOptions = [
    { id: 'natural', name: 'Natural', description: 'Calm and conversational' },
    { id: 'expressive', name: 'Expressive', description: 'Dynamic and animated' },
    { id: 'professional', name: 'Professional', description: 'Clear and formal' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'energetic', name: 'Energetic', description: 'Upbeat and lively' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200 touch-manipulation">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-gray-900/95 backdrop-blur-xl border-gray-700 text-white"
      >
        <DropdownMenuLabel className="text-gray-300">Voice Style</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        {voiceOptions.map((voice) => (
          <DropdownMenuItem
            key={voice.id}
            onClick={() => onVoiceChange(voice.id)}
            className={`flex flex-col items-start px-3 py-3 cursor-pointer transition-colors ${
              currentVoice === voice.id 
                ? 'bg-purple-600/30 text-purple-200' 
                : 'hover:bg-gray-800 text-gray-200'
            }`}
          >
            <div className="font-medium">{voice.name}</div>
            <div className="text-xs text-gray-400">{voice.description}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
