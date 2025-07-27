import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoPreviewProps {
  file: File | null;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function VideoPreview({ file, isPlaying, onPlayPause }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [volume, setVolume] = useState([100]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.play();
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Video Container */}
      <div className="flex-1 bg-black rounded-lg overflow-hidden relative group mb-4">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-ai rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Video Selected</h3>
              <p className="text-sm text-muted-foreground">
                Upload a video file to start editing
              </p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        {videoUrl && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="glass"
              size="lg"
              onClick={onPlayPause}
              className="w-16 h-16 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      {videoUrl && (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground min-w-[45px]">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-ai transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground min-w-[45px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onPlayPause}>
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              
              <Button variant="ghost" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 ml-4">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <div className="w-20">
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8">
                  {volume[0]}%
                </span>
              </div>
            </div>

            <Button variant="ghost" size="sm">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}