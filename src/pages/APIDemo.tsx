
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIPlayground } from '../components/APIPlayground';
import { APIDocumentation } from '../components/APIDocumentation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code, BookOpen, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const APIDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Main Demo
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="playground" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="playground" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              API Playground
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground">
            <APIPlayground />
          </TabsContent>

          <TabsContent value="documentation">
            <APIDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default APIDemo;
