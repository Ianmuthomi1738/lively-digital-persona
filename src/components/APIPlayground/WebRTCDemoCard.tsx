
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebRTCDemo } from '../Avatar/components/WebRTCDemo';
import { Video } from 'lucide-react';

export const WebRTCDemoCard: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          WebRTC Video Communication
          <Badge variant="secondary">New</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WebRTCDemo />
      </CardContent>
    </Card>
  );
};
