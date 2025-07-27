import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Scissors, 
  Brain, 
  Zap, 
  Target,
  Clock,
  Volume2,
  Eye,
  RefreshCw,
  Check,
  X
} from "lucide-react";

interface SmartCuttingProps {
  file?: File | null;
  currentTime?: number;
  duration?: number;
  onTimeChange?: (time: number) => void;
}

export function SmartCutting({ file, currentTime = 0, duration = 0, onTimeChange }: SmartCuttingProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sensitivity, setSensitivity] = useState([75]);
  const [autoApply, setAutoApply] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a video file first");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    console.log("Analyzing video:", file.name, "Duration:", duration);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 4000));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const detectedCuts = [
    { time: "0:15", type: "Scene Change", confidence: 95, reason: "Background transition detected" },
    { time: "0:32", type: "Silence", confidence: 88, reason: "2.3s silence gap found" },
    { time: "0:47", type: "Speaker Change", confidence: 92, reason: "New speaker detected" },
    { time: "1:23", type: "Action Cut", confidence: 78, reason: "Motion pattern change" },
    { time: "1:45", type: "Audio Peak", confidence: 85, reason: "Significant volume change" }
  ];

  const cutTypes = [
    { 
      name: "Scene Changes", 
      icon: Eye, 
      enabled: true, 
      description: "Visual transitions and background changes",
      color: "text-ai-blue"
    },
    { 
      name: "Silence Gaps", 
      icon: Volume2, 
      enabled: true, 
      description: "Pauses and quiet moments",
      color: "text-ai-green"
    },
    { 
      name: "Speaker Changes", 
      icon: Target, 
      enabled: true, 
      description: "Different voices or speakers",
      color: "text-ai-purple"
    },
    { 
      name: "Action Points", 
      icon: Zap, 
      enabled: false, 
      description: "Movement and gesture changes",
      color: "text-ai-orange"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
            <Scissors className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Smart Cutting</h3>
            <p className="text-sm text-muted-foreground">AI detection of optimal cut points</p>
          </div>
        </div>
        
        <Button variant="success" onClick={handleAnalyze} disabled={isAnalyzing || !file}>
          {isAnalyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
          {isAnalyzing ? 'Analyzing...' : file ? 'Analyze Video' : 'Upload Video First'}
        </Button>
      </div>

      {/* Analysis Settings */}
      <Card className="p-4">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">Detection Types</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cutTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${type.color}`} />
                      <div>
                        <div className="text-sm font-medium">{type.name}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                    <Switch checked={type.enabled} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">AI Sensitivity</label>
              <div className="space-y-2">
                <Slider
                  value={sensitivity}
                  onValueChange={setSensitivity}
                  min={1}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>{sensitivity[0]}%</span>
                  <span>Aggressive</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium block">Auto-apply cuts</label>
                <p className="text-xs text-muted-foreground">Automatically apply high-confidence cuts</p>
              </div>
              <Switch checked={autoApply} onCheckedChange={setAutoApply} />
            </div>
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      {analysisComplete && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Detected Cut Points</h4>
              <Badge variant="secondary">
                {detectedCuts.length} cuts found
              </Badge>
            </div>

            <div className="space-y-2">
              {detectedCuts.map((cut, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                      {cut.time}
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">{cut.type}</div>
                      <div className="text-xs text-muted-foreground">{cut.reason}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-muted-foreground">Confidence:</div>
                      <Badge 
                        variant={cut.confidence >= 90 ? "default" : cut.confidence >= 80 ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {cut.confidence}%
                      </Badge>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Check className="w-3 h-3 text-ai-green" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <X className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                <Clock className="w-4 h-4 inline mr-1" />
                Analysis completed in 3.2s
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Preview Cuts
                </Button>
                <Button variant="success" size="sm">
                  Apply All ({detectedCuts.filter(c => c.confidence >= 85).length})
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
              <Brain className="w-6 h-6 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI Analysis in Progress</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Analyzing video content for optimal cut points...
              </p>
              <div className="w-64 h-2 bg-secondary rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-success animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}