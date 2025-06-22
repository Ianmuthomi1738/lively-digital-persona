
export interface VoiceEmotion {
  type: 'neutral' | 'happy' | 'sad' | 'excited' | 'whisper' | 'laugh' | 'angry' | 'surprised';
  intensity?: number; // 0.1 to 1.0
}

export interface SpeechOptions {
  emotion?: VoiceEmotion;
  onViseme?: (viseme: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onInterrupted?: () => void;
}

export interface AvatarAPI {
  speak(text: string, options?: SpeechOptions): Promise<void>;
  listen(onResult: (transcript: string) => void): Promise<void>;
  setExpression(name: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'): void;
  interrupt(): void;
  canInterrupt: boolean;
}
