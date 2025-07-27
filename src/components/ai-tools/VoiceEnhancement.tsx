import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Volume2, 
  Mic, 
  AudioWaveform,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Download,
  Zap,
  Filter,
  VolumeX,
  Music
} from "lucide-react";

interface VoiceEnhancementProps {
  file?: File | null;
  currentTime?: number;
  duration?: number;
  onTimeChange?: (time: number) => void;
}

export function VoiceEnhancement({ file, currentTime = 0, duration = 0, onTimeChange }: VoiceEnhancementProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState([75]);
  const [volumeNormalization, setVolumeNormalization] = useState([80]);
  const [bassBoost, setBassBoost] = useState([0]);
  const [trebleBoost, setTrebleBoost] = useState([0]);

  const handleProcess = async () => {
    if (!file) {
      alert("Please upload an audio/video file first");
      return;
    }
    
    setIsProcessing(true);
    console.log("Enhancing audio for:", file.name);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 4000));
    setIsProcessing(false);
  };

  const audioAnalysis = {
    noiseLevel: 23,
    dynamicRange: 42,
    peakVolume: -3.2,
    averageVolume: -18.5,
    speechClarity: 87,
    backgroundNoise: "Moderate"
  };

  const enhancements = [
    {
      name: "Noise Reduction",
      icon: VolumeX,
      description: "Remove background noise and hiss",
      enabled: true,
      improvement: "+15 dB SNR",
      color: "text-ai-green"
    },
    {
      name: "Voice Clarity",
      icon: Mic,
      description: "Enhance speech intelligibility",
      enabled: true,
      improvement: "+23% clarity",
      color: "text-ai-blue"
    },
    {
      name: "Dynamic Range",
      icon: AudioWaveform,
      description: "Compress and normalize audio levels",
      enabled: true,
      improvement: "±2 dB variance",
      color: "text-ai-purple"
    },
    {
      name: "Music Separation",
      icon: Music,
      description: "Isolate voice from background music",
      enabled: false,
      improvement: "-12 dB music",
      color: "text-ai-orange"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-ai rounded-lg flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Voice Enhancement</h3>
            <p className="text-sm text-muted-foreground">AI audio cleanup and optimization</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            Preview
          </Button>
          
          <Button variant="ai" onClick={handleProcess} disabled={isProcessing || !file}>
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          {isProcessing ? 'Enhancing...' : file ? 'Enhance Audio' : 'Upload File First'}
        </Button>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="enhance">Enhance</TabsTrigger>
          <TabsTrigger value="manual">Manual EQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-4">
          {/* Audio Analysis */}
          <Card className="p-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Audio Analysis</h4>
              
              {/* Waveform Visualization */}
              <div className="bg-black rounded-lg p-4 h-32 flex items-end justify-center gap-1">
                {Array.from({ length: 50 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-ai opacity-80 rounded-t-sm"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      width: "3px"
                    }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Noise Level</div>
                  <div className="text-lg font-semibold">{audioAnalysis.noiseLevel} dB</div>
                </div>
                
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Speech Clarity</div>
                  <div className="text-lg font-semibold">{audioAnalysis.speechClarity}%</div>
                </div>
                
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Dynamic Range</div>
                  <div className="text-lg font-semibold">{audioAnalysis.dynamicRange} dB</div>
                </div>
                
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Peak Volume</div>
                  <div className="text-lg font-semibold">{audioAnalysis.peakVolume} dB</div>
                </div>
                
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Avg Volume</div>
                  <div className="text-lg font-semibold">{audioAnalysis.averageVolume} dB</div>
                </div>
                
                <div className="text-center p-3 bg-secondary/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Background</div>
                  <div className="text-lg font-semibold">{audioAnalysis.backgroundNoise}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommended Enhancements */}
          <Card className="p-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Recommended Enhancements</h4>
              
              <div className="space-y-3">
                {enhancements.map((enhancement, index) => {
                  const Icon = enhancement.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${enhancement.color}`} />
                        <div>
                          <div className="text-sm font-medium">{enhancement.name}</div>
                          <div className="text-xs text-muted-foreground">{enhancement.description}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {enhancement.improvement}
                        </Badge>
                        <Switch checked={enhancement.enabled} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="enhance" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">AI Noise Reduction</label>
                <div className="space-y-2">
                  <Slider
                    value={noiseReduction}
                    onValueChange={setNoiseReduction}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Off</span>
                    <span>{noiseReduction[0]}%</span>
                    <span>Maximum</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Volume Normalization</label>
                <div className="space-y-2">
                  <Slider
                    value={volumeNormalization}
                    onValueChange={setVolumeNormalization}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Off</span>
                    <span>{volumeNormalization[0]}%</span>
                    <span>Maximum</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="text-sm font-medium">AI Presets</h5>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mic className="w-4 h-4 mr-2" />
                      Podcast Enhancement
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Interview Cleanup
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Music className="w-4 h-4 mr-2" />
                      Music Vocal Isolation
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">Quick Actions</h5>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <VolumeX className="w-4 h-4 mr-2" />
                      Remove All Noise
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <AudioWaveform className="w-4 h-4 mr-2" />
                      Auto-Level Audio
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Filter className="w-4 h-4 mr-2" />
                      Enhance Speech
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-6">
              <h4 className="font-semibold">Manual EQ Controls</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Bass Boost</label>
                  <div className="space-y-2">
                    <Slider
                      value={bassBoost}
                      onValueChange={setBassBoost}
                      min={-12}
                      max={12}
                      step={0.5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>-12 dB</span>
                      <span>{bassBoost[0]} dB</span>
                      <span>+12 dB</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Treble Boost</label>
                  <div className="space-y-2">
                    <Slider
                      value={trebleBoost}
                      onValueChange={setTrebleBoost}
                      min={-12}
                      max={12}
                      step={0.5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>-12 dB</span>
                      <span>{trebleBoost[0]} dB</span>
                      <span>+12 dB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Manual adjustments will override AI recommendations
                  </div>
                  <Button variant="outline" size="sm">
                    Reset to AI Settings
                  </Button>
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
            <div className="w-12 h-12 bg-gradient-ai rounded-full flex items-center justify-center mx-auto">
              <Volume2 className="w-6 h-6 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI Audio Enhancement</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Processing audio with advanced noise reduction and clarity enhancement...
              </p>
              <div className="w-64 h-2 bg-secondary rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-ai animate-pulse" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Export Options */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Export Enhanced Audio</h4>
            <p className="text-sm text-muted-foreground">Save your enhanced audio track</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export WAV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export MP3
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}