"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  Subtitles,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  episode: {
    id: string;
    title?: string;
    synopsis?: string;
    videoUrl: string;
    quality1080p?: string;
    quality720p?: string;
    quality480p?: string;
    subtitles?: Array<{
      language: string;
      url: string;
      label: string;
    }>;
    duration?: number;
    number?: number;
  };
  anime: {
    id: string;
    title: any;
  };
  watchHistory?: {
    watchTime: number;
    totalTime: number;
    completed: boolean;
  } | null;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
}

type Quality = "auto" | "1080p" | "720p" | "480p";

export function VideoPlayer({ episode, anime, watchHistory, onProgress, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(watchHistory?.watchTime || 0);
  const [duration, setDuration] = useState(watchHistory?.totalTime || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<Quality>("auto");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);

  const getVideoUrl = (quality: Quality): string => {
    switch (quality) {
      case "1080p":
        return episode.quality1080p || episode.videoUrl;
      case "720p":
        return episode.quality720p || episode.videoUrl;
      case "480p":
        return episode.quality480p || episode.videoUrl;
      default:
        return episode.videoUrl;
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onComplete?.();
    
    // Mark as completed in watch history
    fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        episodeId: episode.id,
        watchTime: duration,
        completed: true,
        userId: 'demo-user' // Would come from auth
      })
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime, video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [episode.id]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="w-full h-full"
          src={getVideoUrl(selectedQuality)}
          controls={false}
          playsInline
          onClick={togglePlayPause}
        />
        
        {/* Loading Buffer */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white animate-spin">⟳</div>
          </div>
        )}

        {/* Center Play Button */}
        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg" 
              onClick={togglePlayPause}
              className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <Play className="w-8 h-8" />
            </Button>
          </div>
        )}

        {/* Subtitles */}
        {selectedSubtitle && showSubtitles && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/70 px-2 py-1 rounded text-sm">
            Subtitle track: {selectedSubtitle}
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-900 p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={(vals: number[]) => {
              if (vals.length > 0 && videoRef.current) {
                const newTime = (vals[0] / 100) * duration;
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            {/* Skip Back */}
            <Button variant="ghost" size="sm" onClick={skipBackward}>
              <SkipBack className="w-4 h-4" />
            </Button>

            {/* Play/Pause */}
            <Button variant="ghost" size="sm" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            {/* Skip Forward */}
            <Button variant="ghost" size="sm" onClick={skipForward}>
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(vals: number[]) => {
                if (vals.length > 0) {
                  handleVolumeChange(vals[0] / 100);
                }
              }}
              className="w-20"
            />
            </div>

            {/* Quality */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowQualityMenu(!showQualityMenu)}
              >
                <Monitor className="w-4 h-4 mr-1" />
                {selectedQuality}
              </Button>
              
              {showQualityMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded shadow-lg p-2 min-w-32">
                  {["auto", "1080p", "720p", "480p"].map((quality) => (
                    <button
                      key={quality}
                      className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-700 ${
                        selectedQuality === quality ? "bg-gray-700 text-blue-400" : "text-white"
                      }`}
                      onClick={() => {
                        setSelectedQuality(quality as Quality);
                        setShowQualityMenu(false);
                      }}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Speed */}
            <select 
              value={playbackSpeed}
              onChange={(e) => {
                const speed = parseFloat(e.target.value);
                if (videoRef.current) {
                  videoRef.current.playbackRate = speed;
                }
                setPlaybackSpeed(speed);
              }}
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            {/* Subtitles */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSubtitles(!showSubtitles)}
            >
              <Subtitles className="w-4 h-4" />
            </Button>

            {/* Fullscreen */}
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Episode Info */}
        <div className="mt-4 text-sm text-gray-300">
          <div className="font-semibold">
            {episode.title || `Episode ${episode.number || 1}`}
          </div>
          {episode.synopsis && (
            <div className="text-gray-400 mt-1 line-clamp-2">
              {episode.synopsis}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}