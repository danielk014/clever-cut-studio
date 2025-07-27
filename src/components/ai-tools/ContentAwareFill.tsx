import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eraser, 
  Sparkles, 
  Target,
  Paintbrush,
  RefreshCw,
  Eye,
  Undo,
  Download,
  Square,
  Circle,
  Lasso
} from "lucide-react";

interface ContentAwareFillProps {
  file?: File | null;
  currentTime?: number;
  duration?: number;
  onTimeChange?: (time: number) => void;
}

export function ContentAwareFill({ file, currentTime = 0, duration = 0, onTimeChange }: ContentAwareFillProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [brushSize, setBrushSize] = useState([10]);
  const [featherAmount, setFeatherAmount] = useState([5]);
  const [fillMethod, setFillMethod] = useState("ai-content-aware");

  const handleProcess = async () => {
    if (!file) {
      alert("Please upload a video file first");
      return;
    }
    
    setIsProcessing(true);
    console.log("Processing content fill for:", file.name);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsProcessing(false);
  };

  const detectedObjects = [
    { name: "Person", confidence: 96, x: 120, y: 80, width: 60, height: 120 },
    { name: "Logo/Watermark", confidence: 92, x: 300, y: 20, width: 80, height: 30 },
    { name: "Text Overlay", confidence: 88, x: 200, y: 180, width: 120, height: 25 },
    { name: "Microphone", confidence: 85, x: 150, y: 150, width: 15, height: 40 }
  ];

  const tools = [
    { id: "brush", name: "Brush", icon: Paintbrush, description: "Paint to select areas" },
    { id: "rectangle", name: "Rectangle", icon: Square, description: "Select rectangular areas" },
    { id: "circle", name: "Circle", icon: Circle, description: "Select circular areas" },
    { id: "lasso", name: "Lasso", icon: Lasso, description: "Free-form selection" }
  ];

  const fillMethods = [
    { value: "ai-content-aware", label: "AI Content-Aware", description: "Best quality, intelligently fills based on surrounding content" },
    { value: "patch", label: "Patch Fill", description: "Fast, uses nearby pixels to fill the area" },
    { value: "blur", label: "Blur Fill", description: "Blurs the selected area to hide content" },
    { value: "clone", label: "Clone Fill", description: "Clones from a selected source area" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
            <Eraser className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Content-Aware Fill</h3>
            <p className="text-sm text-muted-foreground">Remove unwanted elements from your video</p>
          </div>
        </div>
        
        <Button variant="warning" onClick={handleProcess} disabled={isProcessing || !file}>
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isProcessing ? 'Processing...' : file ? 'Apply Fill' : 'Upload Video First'}
        </Button>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">Manual Selection</TabsTrigger>
          <TabsTrigger value="auto">Auto Detect</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4">
          {/* Selection Tools */}
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">Selection Tools</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? "default" : "outline"}
                        className="h-auto p-3 flex flex-col items-center gap-2"
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{tool.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Brush Size</label>
                  <div className="space-y-2">
                    <Slider
                      value={brushSize}
                      onValueChange={setBrushSize}
                      min={1}
                      max={50}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground">
                      {brushSize[0]}px
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Edge Feather</label>
                  <div className="space-y-2">
                    <Slider
                      value={featherAmount}
                      onValueChange={setFeatherAmount}
                      min={0}
                      max={20}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground">
                      {featherAmount[0]}px
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Canvas Area */}
          <Card className="p-4">
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "300px" }}>
              {/* Simulated video frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50" />
              
              {/* Simulated selection overlay */}
              <div className="absolute top-4 right-4 w-20 h-8 border-2 border-dashed border-ai-orange bg-ai-orange/20 rounded" />
              
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Click and drag to select areas to remove</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Undo className="w-4 h-4" />
                  Undo
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                1 area selected
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="auto" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Auto-Detected Objects</h4>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                  Scan Again
                </Button>
              </div>

              <div className="space-y-2">
                {detectedObjects.map((object, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-ai-orange rounded-full" />
                      <div>
                        <div className="text-sm font-medium">{object.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Position: {object.x}, {object.y} • Size: {object.width}×{object.height}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        {object.confidence}% confidence
                      </Badge>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  {detectedObjects.length} objects detected
                </div>
                <Button variant="warning" size="sm">
                  Remove All Detected
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Fill Method</label>
                <Select value={fillMethod} onValueChange={setFillMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fillMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div>
                          <div className="font-medium">{method.label}</div>
                          <div className="text-xs text-muted-foreground">{method.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="text-sm font-medium">Quality Settings</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing Quality</span>
                      <Badge variant="outline">High</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Temporal Consistency</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">Export Options</h5>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Mask Data
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Processing State */}
      {isProcessing && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-warning rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI Processing Content Fill</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Analyzing surrounding pixels and generating seamless fill...
              </p>
              <div className="w-64 h-2 bg-secondary rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-warning animate-pulse" style={{ width: "75%" }} />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}