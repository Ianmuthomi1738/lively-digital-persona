
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Copy, Play, BookOpen, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const APIDocumentation: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    basic: `import { useAvatarSDK } from './api/useAvatarSDK';
import { Avatar } from './components/Avatar/Avatar';

function MyApp() {
  const { connectAvatar, speak, listen, isReady } = useAvatarSDK();
  const avatarRef = useRef();

  useEffect(() => {
    if (avatarRef.current) {
      connectAvatar(avatarRef.current);
    }
  }, [connectAvatar]);

  const handleSpeak = () => {
    speak("Hello! I'm your AI assistant.");
  };

  return (
    <div>
      <Avatar ref={avatarRef} />
      <button onClick={handleSpeak} disabled={!isReady}>
        Speak
      </button>
    </div>
  );
}`,
    advanced: `import { useAvatarSDK } from './api/useAvatarSDK';

const config = {
  voiceStyle: 'friendly',
  initialExpression: 'happy',
  autoListen: true,
  theme: 'blue'
};

const eventHandlers = {
  onSpeakStart: () => console.log('Started speaking'),
  onTranscriptReceived: (text) => console.log('Heard:', text),
  onError: (error) => console.error('Avatar error:', error)
};

function AdvancedApp() {
  const { 
    connectAvatar, 
    speak, 
    listen, 
    setExpression,
    conversation,
    isSpeaking,
    isListening 
  } = useAvatarSDK(config, eventHandlers);

  const handleConversation = async () => {
    try {
      const userInput = await listen();
      const response = await getAIResponse(userInput);
      setExpression('thinking');
      await speak(response);
      setExpression('neutral');
    } catch (error) {
      console.error('Conversation error:', error);
    }
  };

  return (
    <div>
      <Avatar ref={connectAvatar} />
      <div>Status: {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}</div>
      <button onClick={handleConversation}>Start Conversation</button>
    </div>
  );
}`,
    sdk: `import { AvatarSDK } from './api/AvatarSDK';

// Create SDK instance
const avatar = new AvatarSDK({
  voiceStyle: 'natural',
  initialExpression: 'neutral'
}, {
  onSpeakStart: () => console.log('Speaking started'),
  onError: (error) => console.error(error)
});

// Connect to avatar component
avatar.setAvatarRef(avatarRef.current);

// Use the API
await avatar.speak("Hello world!");
const transcript = await avatar.listen();
avatar.setExpression('happy');

// Get conversation history
const messages = avatar.getConversation();
console.log(messages);`
  };

  const apiMethods = [
    {
      name: 'speak(text: string)',
      description: 'Makes the avatar speak the provided text with lip-sync animation',
      returns: 'Promise<void>',
      example: 'await avatar.speak("Hello world!");'
    },
    {
      name: 'listen()',
      description: 'Starts listening for user speech and returns the transcript',
      returns: 'Promise<string>',
      example: 'const transcript = await avatar.listen();'
    },
    {
      name: 'setExpression(expression)',
      description: 'Changes the avatar facial expression',
      returns: 'void',
      example: 'avatar.setExpression("happy");'
    },
    {
      name: 'getConversation()',
      description: 'Returns the full conversation history',
      returns: 'ConversationMessage[]',
      example: 'const messages = avatar.getConversation();'
    },
    {
      name: 'clearConversation()',
      description: 'Clears the conversation history',
      returns: 'void',
      example: 'avatar.clearConversation();'
    },
    {
      name: 'isReady()',
      description: 'Checks if the avatar is initialized and ready to use',
      returns: 'boolean',
      example: 'if (avatar.isReady()) { /* use avatar */ }'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Avatar SDK Documentation
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A comprehensive API for integrating AI avatars into your applications with speech synthesis, recognition, and interactive features.
        </p>
      </div>

      <Tabs defaultValue="quickstart" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quickstart" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Quick Start
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            API Reference
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Examples
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quickstart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Installation</h3>
                <p className="text-gray-600 mb-4">The Avatar SDK is included in this project. Simply import and use:</p>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <code>{`import { useAvatarSDK } from './api/useAvatarSDK';
import { Avatar } from './components/Avatar/Avatar';`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(codeExamples.basic, 'install')}
                  >
                    {copiedCode === 'install' ? 'Copied!' : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExamples.basic}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(codeExamples.basic, 'basic')}
                  >
                    {copiedCode === 'basic' ? 'Copied!' : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiMethods.map((method, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono text-sm">
                        {method.name}
                      </Badge>
                      <Badge variant="secondary">{method.returns}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{method.description}</p>
                    <div className="relative">
                      <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                        <code>{method.example}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => copyToClipboard(method.example, `method-${index}`)}
                      >
                        {copiedCode === `method-${index}` ? '✓' : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.advanced}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(codeExamples.advanced, 'advanced')}
                >
                  {copiedCode === 'advanced' ? 'Copied!' : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Direct SDK Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.sdk}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(codeExamples.sdk, 'sdk')}
                >
                  {copiedCode === 'sdk' ? 'Copied!' : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Property</th>
                      <th className="border border-gray-300 p-3 text-left">Type</th>
                      <th className="border border-gray-300 p-3 text-left">Default</th>
                      <th className="border border-gray-300 p-3 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3 font-mono">voiceStyle</td>
                      <td className="border border-gray-300 p-3">'natural' | 'expressive' | 'professional' | 'friendly' | 'energetic'</td>
                      <td className="border border-gray-300 p-3">'natural'</td>
                      <td className="border border-gray-300 p-3">Voice style for speech synthesis</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-mono">initialExpression</td>
                      <td className="border border-gray-300 p-3">'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised'</td>
                      <td className="border border-gray-300 p-3">'neutral'</td>
                      <td className="border border-gray-300 p-3">Starting facial expression</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-mono">autoListen</td>
                      <td className="border border-gray-300 p-3">boolean</td>
                      <td className="border border-gray-300 p-3">false</td>
                      <td className="border border-gray-300 p-3">Automatically start listening after speaking</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-mono">enableAudioAnalysis</td>
                      <td className="border border-gray-300 p-3">boolean</td>
                      <td className="border border-gray-300 p-3">true</td>
                      <td className="border border-gray-300 p-3">Enable real-time audio visualization</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-mono">theme</td>
                      <td className="border border-gray-300 p-3">'default' | 'blue' | 'purple' | 'green' | 'orange'</td>
                      <td className="border border-gray-300 p-3">'default'</td>
                      <td className="border border-gray-300 p-3">Color theme for the avatar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Handlers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'onSpeakStart', desc: 'Triggered when the avatar starts speaking' },
                  { name: 'onSpeakEnd', desc: 'Triggered when the avatar finishes speaking' },
                  { name: 'onListenStart', desc: 'Triggered when the avatar starts listening' },
                  { name: 'onListenEnd', desc: 'Triggered when the avatar stops listening' },
                  { name: 'onTranscriptReceived', desc: 'Triggered when speech is transcribed', params: '(transcript: string)' },
                  { name: 'onExpressionChange', desc: 'Triggered when facial expression changes', params: '(expression: string)' },
                  { name: 'onError', desc: 'Triggered when an error occurs', params: '(error: Error)' }
                ].map((handler, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                    <Badge variant="outline" className="font-mono text-xs mt-0.5">
                      {handler.name}{handler.params || '()'}
                    </Badge>
                    <span className="text-sm text-gray-600">{handler.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
