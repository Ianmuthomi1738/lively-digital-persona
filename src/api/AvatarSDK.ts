
export interface AvatarConfig {
  voiceStyle?: 'natural' | 'expressive' | 'professional' | 'friendly' | 'energetic';
  initialExpression?: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  autoListen?: boolean;
  enableAudioAnalysis?: boolean;
  theme?: 'default' | 'blue' | 'purple' | 'green' | 'orange';
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  id: string;
}

export interface AvatarEventHandlers {
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
  onListenStart?: () => void;
  onListenEnd?: () => void;
  onTranscriptReceived?: (transcript: string) => void;
  onExpressionChange?: (expression: string) => void;
  onError?: (error: Error) => void;
}

export interface AvatarSDKInstance {
  speak(text: string): Promise<void>;
  listen(): Promise<string>;
  setExpression(expression: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'): void;
  setVoiceStyle(style: string): void;
  getConversation(): ConversationMessage[];
  clearConversation(): void;
  isReady(): boolean;
  destroy(): void;
}

export class AvatarSDK {
  private config: AvatarConfig;
  private eventHandlers: AvatarEventHandlers;
  private conversation: ConversationMessage[] = [];
  private avatarRef: any = null;
  private isInitialized: boolean = false;

  constructor(config: AvatarConfig = {}, eventHandlers: AvatarEventHandlers = {}) {
    this.config = {
      voiceStyle: 'natural',
      initialExpression: 'neutral',
      autoListen: false,
      enableAudioAnalysis: true,
      theme: 'default',
      ...config
    };
    this.eventHandlers = eventHandlers;
  }

  setAvatarRef(ref: any) {
    this.avatarRef = ref;
    this.isInitialized = true;
  }

  async speak(text: string): Promise<void> {
    if (!this.isInitialized || !this.avatarRef) {
      throw new Error('Avatar not initialized. Make sure to connect the SDK to an Avatar component.');
    }

    try {
      this.eventHandlers.onSpeakStart?.();
      await this.avatarRef.speak(text);
      
      // Add to conversation
      this.addMessage('assistant', text);
      
      this.eventHandlers.onSpeakEnd?.();
    } catch (error) {
      this.eventHandlers.onError?.(error as Error);
      throw error;
    }
  }

  async listen(): Promise<string> {
    if (!this.isInitialized || !this.avatarRef) {
      throw new Error('Avatar not initialized. Make sure to connect the SDK to an Avatar component.');
    }

    return new Promise((resolve, reject) => {
      try {
        this.eventHandlers.onListenStart?.();
        
        this.avatarRef.listen((transcript: string) => {
          this.addMessage('user', transcript);
          this.eventHandlers.onTranscriptReceived?.(transcript);
          this.eventHandlers.onListenEnd?.();
          resolve(transcript);
        });
      } catch (error) {
        this.eventHandlers.onError?.(error as Error);
        reject(error);
      }
    });
  }

  setExpression(expression: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'): void {
    if (!this.isInitialized || !this.avatarRef) {
      throw new Error('Avatar not initialized.');
    }

    this.avatarRef.setExpression(expression);
    this.eventHandlers.onExpressionChange?.(expression);
  }

  setVoiceStyle(style: string): void {
    this.config.voiceStyle = style as any;
  }

  getConversation(): ConversationMessage[] {
    return [...this.conversation];
  }

  clearConversation(): void {
    this.conversation = [];
  }

  addMessage(role: 'user' | 'assistant' | 'system', text: string): void {
    const message: ConversationMessage = {
      role,
      text,
      timestamp: new Date(),
      id: Math.random().toString(36).substr(2, 9)
    };
    this.conversation.push(message);
  }

  isReady(): boolean {
    return this.isInitialized && this.avatarRef !== null;
  }

  destroy(): void {
    this.avatarRef = null;
    this.isInitialized = false;
    this.conversation = [];
  }

  getConfig(): AvatarConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<AvatarConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
