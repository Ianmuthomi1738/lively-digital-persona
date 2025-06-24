
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Copy } from 'lucide-react';

interface CodeGeneratorCardProps {
  generatedCode: string;
  onCopyCode: () => void;
}

export const CodeGeneratorCard: React.FC<CodeGeneratorCardProps> = ({
  generatedCode,
  onCopyCode
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Generated Code
          </div>
          <Button variant="outline" size="sm" onClick={onCopyCode}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
          <code>{generatedCode}</code>
        </pre>
      </CardContent>
    </Card>
  );
};
