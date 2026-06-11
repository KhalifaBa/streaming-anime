"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Hls from "hls.js";
import { StreamServer } from "@/types";

interface VideoPlayerProps {
  servers: StreamServer[];
  onProgress?: (progress: number, duration: number) => void;
  initialProgress?: number;
  animeId: string;
  episodeId: string;
}

const INTRO_SKIP_SECONDS = 85;

function VideoPlayer({
  servers,
  onProgress,
  initialProgress,
  animeId,
  episodeId,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [currentServerIdx, setCurrentServerIdx] = useState(0);
  const [currentQuality, setCurrentQuality] = useState(0);
  const [showIntroSkip, setShowIntroSkip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentServer = servers[currentServerIdx];
  const currentSources = currentServer?.sources || [];
  const source = currentSources[currentQuality] || currentSources[0];

  const loadSource = useCallback(
    (src: string) => {
      if (!videoRef.current) return;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (src.endsWith(".m3u8") || src.includes("m3u8")) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsRef.current = hls;
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (initialProgress && initialProgress > 0 && initialProgress < 0.9) {
              videoRef.current!.currentTime =
                videoRef.current!.duration * initialProgress;
            }
          });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (
          videoRef.current.canPlayType("application/vnd.apple.mpegurl")
        ) {
          videoRef.current.src = src;
        }
      } else {
        videoRef.current.src = src;
      }
    },
    [initialProgress]
  );

  useEffect(() => {
    if (source?.url) {
      loadSource(source.url);
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [source, loadSource]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);

      if (video.currentTime > 5 && video.currentTime < INTRO_SKIP_SECONDS + 30) {
        setShowIntroSkip(true);
      } else {
        setShowIntroSkip(false);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      if (initialProgress && initialProgress > 0 && initialProgress < 0.9) {
        video.currentTime = video.duration * initialProgress;
      }
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [initialProgress]);

  useEffect(() => {
    if (!onProgress || !videoRef.current) return;
    progressTimerRef.current = setInterval(() => {
      const video = videoRef.current;
      if (video && video.duration > 0) {
        onProgress(video.currentTime / video.duration, video.duration);
      }
    }, 5000);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [onProgress]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const skipIntro = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = INTRO_SKIP_SECONDS;
    setShowIntroSkip(false);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement?.parentElement;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const switchServer = (idx: number) => {
    setCurrentServerIdx(idx);
    setCurrentQuality(0);
  };

  const switchQuality = (idx: number) => {
    setCurrentQuality(idx);
  };

  return (
    <div
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full max-h-[75vh] cursor-pointer"
        onClick={togglePlay}
        playsInline
        crossOrigin="anonymous"
      />

      {showIntroSkip && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-6 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg z-20 flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,4 15,12 5,20" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
          Passer l&apos;intro
        </button>
      )}

      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 z-20 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/seek"
          onClick={seekTo}
        >
          <div
            className="h-full bg-red-500 rounded-full relative transition-all"
            style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-500 rounded-full opacity-0 group-hover/seek:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-red-400 transition">
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              )}
            </button>

            <button
              onClick={() => {
                const v = videoRef.current;
                if (v) v.currentTime = Math.max(0, v.currentTime - 10);
              }}
              className="text-white hover:text-red-400 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11,19 2,12 11,5" />
                <polygon points="22,19 13,12 22,5" />
              </svg>
            </button>

            <button
              onClick={() => {
                const v = videoRef.current;
                if (v) v.currentTime = Math.min(v.duration, v.currentTime + 10);
              }}
              className="text-white hover:text-red-400 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13,19 22,12 13,5" />
                <polygon points="2,19 11,12 2,5" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-red-400 transition">
                {isMuted || volume === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={changeVolume}
                className="w-20 accent-red-500 h-1"
              />
            </div>

            <span className="text-white text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {servers.length > 1 && (
              <select
                value={currentServerIdx}
                onChange={(e) => switchServer(parseInt(e.target.value))}
                className="bg-white/10 text-white text-sm rounded px-2 py-1 border border-white/20"
              >
                {servers.map((s, i) => (
                  <option key={s.name} value={i} className="bg-gray-800">
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {currentSources.length > 1 && (
              <select
                value={currentQuality}
                onChange={(e) => switchQuality(parseInt(e.target.value))}
                className="bg-white/10 text-white text-sm rounded px-2 py-1 border border-white/20"
              >
                {currentSources.map((s, i) => (
                  <option key={i} value={i} className="bg-gray-800">
                    {s.quality || s.type || `Source ${i + 1}`}
                  </option>
                ))}
              </select>
            )}

            <button onClick={toggleFullscreen} className="text-white hover:text-red-400 transition">
              {isFullscreen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="8,3 3,3 3,8" />
                  <polyline points="16,3 21,3 21,8" />
                  <polyline points="8,21 3,21 3,16" />
                  <polyline points="16,21 21,21 21,16" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="8,3 3,8" />
                  <polyline points="3,3 8,3" />
                  <polyline points="21,8 16,3" />
                  <polyline points="16,3 21,3" />
                  <polyline points="8,21 3,16" />
                  <polyline points="3,21 8,21" />
                  <polyline points="21,16 16,21" />
                  <polyline points="16,21 21,21" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
