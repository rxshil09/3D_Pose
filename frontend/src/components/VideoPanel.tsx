import { Play, Pause, SkipBack, SkipForward, Maximize2, Minimize2, Box } from "lucide-react";
import { useState, lazy, Suspense, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";

const Skeleton3DViewer = lazy(() => import("./Skeleton3DViewer"));

interface VideoPanelProps {
  title: string;
  isPoseView?: boolean;
  showUploadCta?: boolean;
}

const VideoPanel = ({ title, isPoseView, showUploadCta }: VideoPanelProps) => {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState([142]);
  const [showJoints, setShowJoints] = useState(true);
  const [showBones, setShowBones] = useState(true);
  const [show3D, setShow3D] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!isMaximized) return;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMaximized(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMaximized]);

  return (
    <>
      {isMaximized && (
        <div
          className="fixed inset-0 z-[70] bg-black/70"
          onClick={() => setIsMaximized(false)}
          aria-hidden="true"
        />
      )}
      <div className={isMaximized ? "fixed inset-2 sm:inset-4 z-[80] flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-2xl" : "glass-card overflow-hidden flex-1 min-w-0"}>
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border">
        <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">{title}</h3>
        <div className="flex items-center gap-1">
          {isPoseView && (
            <button
              onClick={() => setShow3D(!show3D)}
              className={`p-1 rounded text-muted-foreground hover:text-foreground transition-colors ${show3D ? "text-accent bg-accent/10" : ""}`}
              title="Toggle 3D View"
            >
              <Box className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsMaximized((prev) => !prev)}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            title={isMaximized ? "Exit Fullscreen" : "Maximize Panel"}
            aria-label={isMaximized ? "Exit fullscreen" : "Maximize panel"}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Video area */}
      <div className={`${isMaximized ? "flex-1 min-h-0" : "aspect-video"} bg-background/60 relative flex items-center justify-center`}>
        {isPoseView ? (
          show3D ? (
            <Suspense fallback={
              <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xs">
                Loading 3D viewer...
              </div>
            }>
              <Skeleton3DViewer showJoints={showJoints} showBones={showBones} showHeatmap={showHeatmap} />
            </Suspense>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 200 300" className="h-3/4 opacity-80">
                <circle cx="100" cy="30" r="15" fill="none" stroke="hsl(185 75% 55%)" strokeWidth="2" />
                <line x1="100" y1="45" x2="100" y2="140" stroke="hsl(215 80% 55%)" strokeWidth="2" />
                <line x1="100" y1="70" x2="55" y2="120" stroke="hsl(215 80% 55%)" strokeWidth="2" />
                <line x1="100" y1="70" x2="145" y2="120" stroke="hsl(215 80% 55%)" strokeWidth="2" />
                <line x1="100" y1="140" x2="65" y2="230" stroke="hsl(215 80% 55%)" strokeWidth="2" />
                <line x1="100" y1="140" x2="135" y2="230" stroke="hsl(215 80% 55%)" strokeWidth="2" />
                <line x1="65" y1="230" x2="55" y2="280" stroke="hsl(215 80% 55%)" strokeWidth="2" />
                <line x1="135" y1="230" x2="145" y2="280" stroke="hsl(215 80% 55%)" strokeWidth="2" />
                {showJoints && (
                  <>
                    {[[100,45],[100,70],[55,120],[145,120],[100,140],[65,230],[135,230],[55,280],[145,280]].map(([cx,cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="4" fill="hsl(185 75% 55%)" opacity="0.9" />
                    ))}
                  </>
                )}
              </svg>
              {showHeatmap && (
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-primary/10 to-accent/5 pointer-events-none" />
              )}
            </div>
          )
        ) : (
          showUploadCta ? (
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              aria-label="Upload video"
              title="Upload video"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 opacity-30" />
              <span className="text-xs">No video loaded</span>
            </div>
          )
        )}
      </div>

      {/* Controls */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-border space-y-2 sm:space-y-3">
        <Slider value={frame} onValueChange={setFrame} max={300} step={1} className="w-full" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <SkipBack className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="p-1.5 sm:p-2 rounded-md bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
            >
              {playing ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono text-muted-foreground">
            <span>Frame {frame[0]}/300</span>
            <span className="hidden sm:inline">00:{String(Math.floor(frame[0] / 30)).padStart(2, "0")}:{String(frame[0] % 30).padStart(2, "0")}</span>
          </div>
        </div>

        {isPoseView && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
            {[
              { label: "Joints", checked: showJoints, onChange: setShowJoints },
              { label: "Bones", checked: showBones, onChange: setShowBones },
              { label: "3D View", checked: show3D, onChange: setShow3D },
              { label: "Heatmap", checked: showHeatmap, onChange: setShowHeatmap },
            ].map((toggle) => (
              <label key={toggle.label} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground cursor-pointer">
                <Switch
                  checked={toggle.checked}
                  onCheckedChange={toggle.onChange}
                  className="scale-[0.65] sm:scale-75"
                />
                {toggle.label}
              </label>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default VideoPanel;
