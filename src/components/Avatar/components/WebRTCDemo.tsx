
import React, { useState } from 'react';
import { WebRTCVideoChat } from './WebRTCVideoChat';
import { WebRTCSignaling } from './WebRTCSignaling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const WebRTCDemo: React.FC = () => {
  const [currentOffer, setCurrentOffer] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  const handleOfferCreated = (offer: RTCSessionDescriptionInit) => {
    const offerString = JSON.stringify(offer, null, 2);
    setCurrentOffer(offerString);
    console.log('Offer created:', offer);
  };

  const handleAnswerCreated = (answer: RTCSessionDescriptionInit) => {
    const answerString = JSON.stringify(answer, null, 2);
    setCurrentAnswer(answerString);
    console.log('Answer created:', answer);
  };

  const handleIceCandidate = (candidate: RTCIceCandidateInit) => {
    console.log('ICE candidate:', candidate);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            WebRTC Integration Demo
            <Badge variant="secondary">Real-time Video Chat</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Experience real-time video communication with the AI avatar using WebRTC technology. 
            This enables peer-to-peer video calls with low latency and high quality.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="video" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="video">Video Chat</TabsTrigger>
          <TabsTrigger value="signaling">Signaling</TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4">
          <WebRTCVideoChat
            config={{
              enableVideo: true,
              enableAudio: true,
              videoConstraints: { width: 640, height: 480 }
            }}
            onOfferCreated={handleOfferCreated}
            onAnswerCreated={handleAnswerCreated}
            onIceCandidate={handleIceCandidate}
          />
        </TabsContent>

        <TabsContent value="signaling" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WebRTCSignaling />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated SDP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentOffer && (
                  <div>
                    <label className="text-sm font-medium">Current Offer:</label>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                      {currentOffer}
                    </pre>
                  </div>
                )}
                
                {currentAnswer && (
                  <div>
                    <label className="text-sm font-medium">Current Answer:</label>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                      {currentAnswer}
                    </pre>
                  </div>
                )}
                
                {!currentOffer && !currentAnswer && (
                  <p className="text-gray-500 text-sm">
                    Start a video call to generate SDP data
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
