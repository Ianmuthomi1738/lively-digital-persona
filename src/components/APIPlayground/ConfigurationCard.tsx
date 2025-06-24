
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface ConfigurationCardProps {
  selectedExpression: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  onExpressionChange: (expression: string) => void;
  selectedVoiceStyle: string;
  setSelectedVoiceStyle: (style: string) => void;
}

export const ConfigurationCard: React.FC<ConfigurationCardProps> = ({
  selectedExpression,
  onExpressionChange,
  selectedVoiceStyle,
  setSelectedVoiceStyle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Expression</label>
          <Select value={selectedExpression} onValueChange={onExpressionChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="happy">Happy</SelectItem>
              <SelectItem value="sad">Sad</SelectItem>
              <SelectItem value="thinking">Thinking</SelectItem>
              <SelectItem value="surprised">Surprised</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Voice Style</label>
          <Select value={selectedVoiceStyle} onValueChange={setSelectedVoiceStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="natural">Natural</SelectItem>
              <SelectItem value="expressive">Expressive</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="energetic">Energetic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
