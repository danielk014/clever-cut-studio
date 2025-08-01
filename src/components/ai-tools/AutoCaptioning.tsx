import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  Type, 
  Palette, 
  Settings, 
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";

interface AutoCaptioningProps {
  file?: File | null;
  currentTime?: number;
  duration?: number;
  onTimeChange?: (time: number) => void;
}

export function AutoCaptioning({ file, currentTime = 0, duration = 0, onTimeChange }: AutoCaptioningProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<Array<{start: number, end: number, text: string}>>([]);
  const [showCaptions, setShowCaptions] = useState(true);
  const [fontSize, setFontSize] = useState([24]);
  const [opacity, setOpacity] = useState([90]);
  const [language, setLanguage] = useState("en");
  
  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload a video file first");
      return;
    }
    
    setIsGenerating(true);
    // Simulate AI processing with actual file analysis
    console.log("Generating captions for:", file.name, "Duration:", duration);
    
    // Simulate processing time based on file duration
    const processingTime = Math.max(2000, duration * 100);
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Generate sample captions based on video duration
    const sampleCaptions = generateSampleCaptions(duration);
    setCaptions(sampleCaptions);
    
    setIsGenerating(false);
    console.log("Captions generated:", sampleCaptions.length, "segments");
  };

  const generateSampleCaptions = (videoDuration: number) => {
    const captions = [];
    const sampleTexts = [
      "Welcome to our video presentation.",
      "Today we'll be discussing important topics.",
      "Let's start with the main concepts.",
      "This feature allows you to create amazing content.",
      "The AI technology helps streamline your workflow.",
      "You can customize settings to fit your needs.",
      "Quality and performance are our top priorities.",
      "Thank you for watching our demonstration."
    ];

    let currentTime = 0;
    const segmentDuration = videoDuration / sampleTexts.length;

    for (let i = 0; i < sampleTexts.length && currentTime < videoDuration; i++) {
      const start = currentTime;
      const end = Math.min(currentTime + segmentDuration, videoDuration);
      
      captions.push({
        start: start,
        end: end,
        text: sampleTexts[i]
      });
      
      currentTime += segmentDuration;
    }

    return captions;
  };

  const getCurrentCaption = () => {
    if (!currentTime || !captions.length) return null;
    return captions.find(caption => 
      currentTime >= caption.start && currentTime <= caption.end
    );
  };

  const captionStyles = [
    { name: "Classic", preview: "bg-black/80 text-white px-3 py-1 rounded" },
    { name: "Modern", preview: "bg-white/90 text-black px-4 py-2 rounded-lg border" },
    { name: "Neon", preview: "bg-gradient-ai text-white px-3 py-1 rounded border border-ai-purple" },
    { name: "Minimal", preview: "text-white drop-shadow-lg" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-ai rounded-lg flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Auto-Captioning</h3>
            <p className="text-sm text-muted-foreground">AI-generated captions with custom styling</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCaptions(!showCaptions)}
          >
            {showCaptions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showCaptions ? 'Hide' : 'Show'}
          </Button>
          
          <Button variant="ai" onClick={handleGenerate} disabled={isGenerating || !file}>
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : file ? 'Generate Captions' : 'Upload Video First'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">AI Processing Options</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Badge variant="secondary" className="mr-2">AI</Badge>
                    Auto-sync
                  </Button>
                  <Button variant="outline" size="sm">
                    <Badge variant="secondary" className="mr-2">AI</Badge>
                    Speaker ID
                  </Button>
                  <Button variant="outline" size="sm">
                    <Badge variant="secondary" className="mr-2">AI</Badge>
                    Punctuation
                  </Button>
                  <Button variant="outline" size="sm">
                    <Badge variant="secondary" className="mr-2">AI</Badge>
                    Formatting
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Caption Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {captionStyles.map((style) => (
                    <Button
                      key={style.name}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start gap-2"
                    >
                      <div className={`text-xs px-2 py-1 ${style.preview}`}>
                        Sample Text
                      </div>
                      <span className="text-sm">{style.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Font Size</label>
                  <div className="space-y-2">
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={12}
                      max={48}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground">
                      {fontSize[0]}px
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Opacity</label>
                  <div className="space-y-2">
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      min={0}
                      max={100}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground">
                      {opacity[0]}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="bg-black rounded-lg p-6 min-h-[200px] flex items-end justify-center relative">
                {/* Simulated video background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg" />
                
                {showCaptions && getCurrentCaption() && (
                  <div 
                    className="bg-black/80 text-white px-4 py-2 rounded text-center max-w-[80%] relative z-10"
                    style={{ 
                      fontSize: `${fontSize[0]}px`,
                      opacity: opacity[0] / 100 
                    }}
                  >
                    {getCurrentCaption()?.text}
                  </div>
                )}
                
                {showCaptions && !getCurrentCaption() && captions.length > 0 && (
                  <div 
                    className="bg-black/80 text-white px-4 py-2 rounded text-center max-w-[80%] relative z-10"
                    style={{ 
                      fontSize: `${fontSize[0]}px`,
                      opacity: opacity[0] / 100 
                    }}
                  >
                    {captions[0]?.text || "This is a sample caption that will appear in your video"}
                  </div>
                )}
                
                {showCaptions && captions.length === 0 && (
                  <div 
                    className="bg-black/80 text-white px-4 py-2 rounded text-center max-w-[80%] relative z-10"
                    style={{ 
                      fontSize: `${fontSize[0]}px`,
                      opacity: opacity[0] / 100 
                    }}
                  >
                    This is a sample caption that will appear in your video
                  </div>
                )}
                
                {!showCaptions && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <p className="text-sm">Captions hidden</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Caption preview • {fontSize[0]}px • {opacity[0]}% opacity
                  {captions.length > 0 && ` • ${captions.length} segments generated`}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={captions.length === 0}>
                    <Download className="w-4 h-4" />
                    Export SRT
                  </Button>
                  <Button variant="outline" size="sm" disabled={captions.length === 0}>
                    <Download className="w-4 h-4" />
                    Export VTT
                  </Button>
                </div>
              </div>

              {captions.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <h5 className="text-sm font-medium">Generated Captions:</h5>
                  {captions.map((caption, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded text-sm">
                      <div className="flex-1">
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          {Math.floor(caption.start)}s-{Math.floor(caption.end)}s
                        </span>
                        <span>{caption.text}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onTimeChange?.(caption.start)}
                        className="ml-2"
                      >
                        Go to
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}