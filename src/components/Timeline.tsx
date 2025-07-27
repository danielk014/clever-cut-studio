import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Scissors, Plus } from "lucide-react";

interface TimelineProps {
  duration: number;
  currentTime: number;
  onTimeChange: (time: number) => void;
  file: File | null;
}

export function Timeline({ duration, currentTime, onTimeChange, file }: TimelineProps) {
  const [zoom, setZoom] = useState(1);
  const [cuts, setCuts] = useState<number[]>([]);
  const [selectedCut, setSelectedCut] = useState<number | null>(null);

  const handleAddCut = () => {
    if (!cuts.includes(currentTime) && file) {
      setCuts([...cuts, currentTime].sort((a, b) => a - b));
      console.log('Cut added at:', formatTime(currentTime));
    }
  };

  const handleRemoveCut = (cutTime: number) => {
    setCuts(cuts.filter(cut => cut !== cutTime));
    console.log('Cut removed at:', formatTime(cutTime));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const timeMarkers = [];
  const interval = Math.max(1, Math.floor(duration / (10 * zoom)));
  for (let i = 0; i <= duration; i += interval) {
    timeMarkers.push(i);
  }

  return (
    <div className="space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Timeline</h3>
          <div className="text-sm text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <div className="w-20">
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={0.1}
              max={5}
              step={0.1}
              className="cursor-pointer"
            />
          </div>

          <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(5, zoom + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          <div className="w-px h-4 bg-border mx-2" />

          <Button variant="ghost" size="sm" onClick={handleAddCut} disabled={!file || duration === 0}>
            <Scissors className="w-4 h-4" />
            Cut
          </Button>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="relative bg-secondary/50 rounded-lg p-4 min-h-[120px]">
        {duration > 0 ? (
          <>
            {/* Time Markers */}
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              {timeMarkers.map((time) => (
                <div key={time} className="flex flex-col items-center">
                  <div className="w-px h-2 bg-border" />
                  <span>{formatTime(time)}</span>
                </div>
              ))}
            </div>

            {/* Main Video Track */}
            <div className="relative bg-gradient-ai/20 border border-ai-purple/30 rounded h-12 mb-2">
              <div className="absolute inset-0 flex items-center px-3">
                <span className="text-sm font-medium">Video Track</span>
              </div>
              
              {/* Cut Points */}
              {cuts.map((cutTime) => (
                <div
                  key={cutTime}
                  className="absolute top-0 bottom-0 w-px bg-destructive cursor-pointer hover:bg-destructive/80 group"
                  style={{ left: `${(cutTime / duration) * 100}%` }}
                  onClick={() => setSelectedCut(cutTime)}
                >
                  <div className="absolute -top-2 -left-2 w-5 h-5 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs text-destructive-foreground">×</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Audio Track */}
            <div className="relative bg-gradient-success/20 border border-ai-green/30 rounded h-8 mb-2">
              <div className="absolute inset-0 flex items-center px-3">
                <span className="text-xs font-medium">Audio Track</span>
              </div>
            </div>

            {/* AI Analysis Track */}
            <div className="relative bg-gradient-warning/20 border border-ai-orange/30 rounded h-6">
              <div className="absolute inset-0 flex items-center px-3">
                <span className="text-xs font-medium">AI Analysis</span>
              </div>
              
              {/* AI Suggestions */}
              <div className="absolute top-1 left-4 w-2 h-4 bg-ai-orange rounded-sm opacity-80" />
              <div className="absolute top-1 left-12 w-2 h-4 bg-ai-orange rounded-sm opacity-80" />
              <div className="absolute top-1 left-20 w-2 h-4 bg-ai-orange rounded-sm opacity-80" />
            </div>

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-px bg-primary z-10 pointer-events-none"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full" />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Timeline will appear when you upload a video</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Controls */}
      {duration > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              onValueChange={(value) => onTimeChange(value[0])}
              max={duration}
              step={0.1}
              className="cursor-pointer"
            />
          </div>
          
          {cuts.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {cuts.length} cuts added
              </div>
              <Button variant="destructive" size="sm" onClick={() => setCuts([])}>
                Clear All Cuts
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Cut Management */}
      {selectedCut !== null && (
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Cut Point at {formatTime(selectedCut)}</h4>
              <p className="text-sm text-muted-foreground">Click to remove this cut point</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onTimeChange(selectedCut)}>
                Go to Cut
              </Button>
              <Button variant="destructive" size="sm" onClick={() => {
                handleRemoveCut(selectedCut);
                setSelectedCut(null);
              }}>
                Remove Cut
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}