import DashboardLayout from "@/components/DashboardLayout";
import VideoPanel from "@/components/VideoPanel";
import MetricCard from "@/components/MetricCard";
import MiniChart from "@/components/MiniChart";
import ExperimentControls from "@/components/ExperimentControls";
import { Link2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const errorOcclusionData = [
  { name: "0%", value: 32 },
  { name: "20%", value: 38 },
  { name: "40%", value: 52 },
  { name: "60%", value: 78 },
  { name: "80%", value: 105 },
  { name: "100%", value: 142 },
];

const confidenceData = [
  { name: "Head", value: 0.95 },
  { name: "Shoulder", value: 0.92 },
  { name: "Elbow", value: 0.87 },
  { name: "Wrist", value: 0.79 },
  { name: "Hip", value: 0.91 },
  { name: "Knee", value: 0.85 },
  { name: "Ankle", value: 0.72 },
];

const modelComparisonData = [
  { name: "HRNet", value: 42, value2: 38 },
  { name: "OpenPose", value: 56, value2: 49 },
  { name: "Baseline", value: 68, value2: 62 },
];

const Dashboard = () => {
  const [synced, setSynced] = useState(true);

  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
          {/* Sync control */}
          <div className="flex items-center gap-3">
            <Link2 className="w-4 h-4 text-accent" />
            <label className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground cursor-pointer">
              <Switch checked={synced} onCheckedChange={setSynced} className="scale-90" />
              Synchronized Playback
            </label>
          </div>

          {/* Video panels */}
          <div className="flex flex-col lg:flex-row gap-4">
            <VideoPanel title="Original Video" showUploadCta />
            <VideoPanel title="Pose Estimation Visualization" isPoseView />
          </div>

          {/* Metadata row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="glass-card px-3 sm:px-4 py-2.5 sm:py-3">
              <span className="text-[10px] sm:text-xs text-muted-foreground">Frame</span>
              <p className="text-xs sm:text-sm font-mono text-foreground">142 / 300</p>
            </div>
            <div className="glass-card px-3 sm:px-4 py-2.5 sm:py-3">
              <span className="text-[10px] sm:text-xs text-muted-foreground">Inference Time</span>
              <p className="text-xs sm:text-sm font-mono text-foreground">23.4 ms</p>
            </div>
            <div className="glass-card px-3 sm:px-4 py-2.5 sm:py-3">
              <span className="text-[10px] sm:text-xs text-muted-foreground">Detected Joints</span>
              <p className="text-xs sm:text-sm font-mono text-foreground">17 / 17</p>
            </div>
            <div className="glass-card px-3 sm:px-4 py-2.5 sm:py-3">
              <span className="text-[10px] sm:text-xs text-muted-foreground">Model</span>
              <p className="text-xs sm:text-sm font-mono text-accent">HRNet-W48</p>
            </div>
          </div>

          {/* Experiment Controls */}
          <ExperimentControls />
        </div>

        {/* Right metrics panel */}
        <div className="w-full xl:w-72 space-y-4 shrink-0">
          <h3 className="text-sm font-semibold text-foreground">Evaluation Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-3 sm:gap-4">
            <MetricCard label="MPJPE" value="42.3" unit="mm" tooltip="Mean Per Joint Position Error — average distance between predicted and ground truth joint positions" trend="down" accent />
            <MetricCard label="PA-MPJPE" value="38.1" unit="mm" tooltip="Procrustes-Aligned MPJPE — MPJPE after rigid alignment to ground truth" trend="down" />
            <MetricCard label="Avg Confidence" value="0.87" tooltip="Average joint detection confidence score across all joints" trend="up" />
            <MetricCard label="FPS" value="42.7" unit="fps" tooltip="Frames per second during inference" />
            <MetricCard label="Occlusion Level" value="25" unit="%" tooltip="Current simulated occlusion level applied to the input" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            <MiniChart title="Error vs Occlusion" type="line" data={errorOcclusionData} color="hsl(215, 80%, 55%)" />
            <MiniChart title="Joint Confidence" type="bar" data={confidenceData.map(d => ({ ...d, value: d.value * 100 }))} color="hsl(185, 75%, 55%)" />
            <MiniChart title="Model Comparison (MPJPE)" type="bar" data={modelComparisonData} color="hsl(215, 80%, 55%)" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
