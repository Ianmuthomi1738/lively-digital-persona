
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, StopCircle } from 'lucide-react';
import { Avatar } from '../Avatar/Avatar';

interface AvatarDemoCardProps {
  avatarRef: React.RefObject<any>;
  selectedExpression: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  isReady: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  canInterrupt: boolean;
  onInterrupt: () => void;
}

export const AvatarDemoCard: React.FC<AvatarDemoCardProps> = ({
  avatarRef,
  selectedExpression,
  isReady,
  isSpeaking,
  isListening,
  canInterrupt,
  onInterrupt
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Live Demo
          </div>
          {canInterrupt && (
            <Button
              onClick={onInterrupt}
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
              onInterrupted={() => {}}
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
  );
};
