
export interface AvatarAPI {
  speak(text: string): Promise<void>;
  listen(onResult: (transcript: string) => void): Promise<void>;
  setExpression(name: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'): void;
}
