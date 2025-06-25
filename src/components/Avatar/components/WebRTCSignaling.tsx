
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Paste } from 'lucide-react';
import { toast } from 'sonner';

interface WebRTCSignalingProps {
  onOfferReceived?: (offer: RTCSessionDescriptionInit) => void;
  onAnswerReceived?: (answer: RTCSessionDescriptionInit) => void;
  onIceCandidateReceived?: (candidate: RTCIceCandidateInit) => void;
  className?: string;
}

export const WebRTCSignaling: React.FC<WebRTCSignalingProps> = ({
  onOfferReceived,
  onAnswerReceived,
  onIceCandidateReceived,
  className = ''
}) => {
  const [offerText, setOfferText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [candidateText, setCandidateText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const pasteFromClipboard = async (setter: (value: string) => void, type: string) => {
    try {
      const text = await navigator.clipboard.readText();
      setter(text);
      toast.success(`${type} pasted from clipboard`);
    } catch (error) {
      console.error('Failed to paste:', error);
      toast.error('Failed to paste from clipboard');
    }
  };

  const handleProcessOffer = () => {
    try {
      const offer = JSON.parse(offerText);
      onOfferReceived?.(offer);
      toast.success('Offer processed successfully');
    } catch (error) {
      console.error('Failed to process offer:', error);
      toast.error('Invalid offer format');
    }
  };

  const handleProcessAnswer = () => {
    try {
      const answer = JSON.parse(answerText);
      onAnswerReceived?.(answer);
      toast.success('Answer processed successfully');
    } catch (error) {
      console.error('Failed to process answer:', error);
      toast.error('Invalid answer format');
    }
  };

  const handleProcessCandidate = () => {
    try {
      const candidate = JSON.parse(candidateText);
      onIceCandidateReceived?.(candidate);
      toast.success('ICE candidate processed successfully');
    } catch (error) {
      console.error('Failed to process ICE candidate:', error);
      toast.error('Invalid ICE candidate format');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>WebRTC Signaling</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Offer Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Offer (SDP)</label>
          <div className="flex gap-2">
            <Textarea
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
              placeholder="Paste offer JSON here..."
              className="min-h-20 font-mono text-xs"
            />
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => pasteFromClipboard(setOfferText, 'Offer')}
              >
                <Paste className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(offerText, 'Offer')}
                disabled={!offerText}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={handleProcessOffer}
            disabled={!offerText}
            size="sm"
            className="w-full"
          >
            Process Offer
          </Button>
        </div>

        {/* Answer Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Answer (SDP)</label>
          <div className="flex gap-2">
            <Textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Paste answer JSON here..."
              className="min-h-20 font-mono text-xs"
            />
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => pasteFromClipboard(setAnswerText, 'Answer')}
              >
                <Paste className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(answerText, 'Answer')}
                disabled={!answerText}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={handleProcessAnswer}
            disabled={!answerText}
            size="sm"
            className="w-full"
          >
            Process Answer
          </Button>
        </div>

        {/* ICE Candidate Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">ICE Candidates</label>
          <div className="flex gap-2">
            <Textarea
              value={candidateText}
              onChange={(e) => setCandidateText(e.target.value)}
              placeholder="Paste ICE candidate JSON here..."
              className="min-h-20 font-mono text-xs"
            />
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => pasteFromClipboard(setCandidateText, 'ICE Candidate')}
              >
                <Paste className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(candidateText, 'ICE Candidate')}
                disabled={!candidateText}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={handleProcessCandidate}
            disabled={!candidateText}
            size="sm"
            className="w-full"
          >
            Process ICE Candidate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
