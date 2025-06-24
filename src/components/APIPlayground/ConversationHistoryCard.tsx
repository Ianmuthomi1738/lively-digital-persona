
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ConversationMessage } from '../../api/AvatarSDK';

interface ConversationHistoryCardProps {
  conversation: ConversationMessage[];
  onClearConversation: () => void;
}

export const ConversationHistoryCard: React.FC<ConversationHistoryCardProps> = ({
  conversation,
  onClearConversation
}) => {
  return (
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
            onClick={onClearConversation}
            className="mt-2 w-full"
          >
            Clear History
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
