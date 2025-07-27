import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Wand2, 
  Scissors, 
  Eraser, 
  Volume2, 
  Play, 
  Pause,
  Download,
  Settings
} from "lucide-react";
import { AutoCaptioning } from "./ai-tools/AutoCaptioning";
import { SmartCutting } from "./ai-tools/SmartCutting";
import { ContentAwareFill } from "./ai-tools/ContentAwareFill";
import { VoiceEnhancement } from "./ai-tools/VoiceEnhancement";
import { VideoPreview } from "./VideoPreview";
import { Timeline } from "./Timeline";

export function VideoEditor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAITool, setActiveAITool] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/webm', 'audio/mp3', 'audio/wav', 'audio/m4a'];
      if (!validTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
        alert('Please upload a valid video or audio file (MP4, AVI, MOV, WebM, MP3, WAV, M4A)');
        return;
      }
      
      setSelectedFile(file);
      // Create video URL for preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Reset states
      setCurrentTime(0);
      setIsPlaying(false);
      setActiveAITool(null);
      
      console.log('File uploaded:', file.name, 'Type:', file.type, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
    }
  };

  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  const aiTools = [
    {
      id: "captions",
      name: "Auto-Captioning",
      icon: Wand2,
      description: "AI-generated captions with custom styling",
      gradient: "bg-gradient-ai",
      component: AutoCaptioning
    },
    {
      id: "cutting",
      name: "Smart Cutting", 
      icon: Scissors,
      description: "AI detection of optimal cut points",
      gradient: "bg-gradient-success",
      component: SmartCutting
    },
    {
      id: "fill",
      name: "Content-Aware Fill",
      icon: Eraser,
      description: "Remove unwanted elements",
      gradient: "bg-gradient-warning",
      component: ContentAwareFill
    },
    {
      id: "voice",
      name: "Voice Enhancement",
      icon: Volume2,
      description: "AI audio cleanup and optimization", 
      gradient: "bg-gradient-ai",
      component: VoiceEnhancement
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-ai rounded-lg flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">AI Video Studio</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ai" className="gap-2">
                <Download className="w-4 h-4" />
                Export Video
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* AI Tools Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 text-foreground">AI Tools</h2>
              
              <div className="space-y-3">
                {aiTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant={activeAITool === tool.id ? "ai" : "ghost"}
                      className="w-full justify-start h-auto p-4 flex-col items-start gap-2"
                      onClick={() => setActiveAITool(activeAITool === tool.id ? null : tool.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-8 h-8 ${tool.gradient} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{tool.name}</div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-left w-full">
                        {tool.description}
                      </p>
                    </Button>
                  );
                })}
              </div>
            </Card>

            {/* Upload Section */}
            <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-ai rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Upload Video</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drop your video file or click to browse
                </p>
                <label htmlFor="video-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {selectedFile && (
                  <div className="mt-3 p-2 bg-secondary rounded-lg">
                    <p className="text-xs text-secondary-foreground truncate">
                      {selectedFile.name}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Video Preview */}
            <Card className="flex-1 p-6 border-border/50 bg-card/80 backdrop-blur-sm">
              <VideoPreview 
                file={selectedFile}
                videoUrl={videoUrl}
                isPlaying={isPlaying} 
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onTimeUpdate={handleTimeChange}
                onDurationChange={handleDurationChange}
              />
            </Card>

            {/* AI Tool Panel */}
            {activeAITool && (
              <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
                <Tabs value={activeAITool} className="w-full">
                  {aiTools.map((tool) => (
                    <TabsContent key={tool.id} value={tool.id}>
                      <tool.component 
                        file={selectedFile}
                        currentTime={currentTime}
                        duration={duration}
                        onTimeChange={handleTimeChange}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            )}

            {/* Timeline */}
            <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
              <Timeline 
                duration={duration} 
                currentTime={currentTime}
                onTimeChange={handleTimeChange}
                file={selectedFile}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}