
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReleaseData } from "./ModuleForm";
import { CheckCircle, Clock, Target } from "lucide-react";
import { EditReleaseDialog } from "./EditReleaseDialog";

interface ReleaseCardProps {
  release: ReleaseData;
  onUpdate: (updatedRelease: ReleaseData) => void;
}

export function ReleaseCard({ release, onUpdate }: ReleaseCardProps) {
  const precision = release.tp + release.fp > 0 ? (release.tp / (release.tp + release.fp)).toFixed(3) : "N/A";
  const recall = release.tp + release.fn > 0 ? (release.tp / (release.tp + release.fn)).toFixed(3) : "N/A";
  const f1Score = precision !== "N/A" && recall !== "N/A" 
    ? (2 * (parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall))).toFixed(3)
    : "N/A";

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-slate-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-slate-800 font-bold">{release.version}</CardTitle>
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 font-medium">
              {release.architecture}
            </Badge>
            {release.modelUpdate && (
              <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Updated
              </Badge>
            )}
            <EditReleaseDialog release={release} onUpdate={onUpdate} />
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">{release.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <Target className="w-5 h-5 mx-auto mb-2 text-blue-600" />
            <div className="text-xl font-bold text-blue-700">
              {(release.accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-blue-600 font-medium">Accuracy</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <div className="text-xl font-bold text-emerald-700">{precision}</div>
            <div className="text-xs text-emerald-600 font-medium">Precision</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="text-xl font-bold text-purple-700">{recall}</div>
            <div className="text-xs text-purple-600 font-medium">Recall</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
            <div className="text-xl font-bold text-orange-700">{f1Score}</div>
            <div className="text-xs text-orange-600 font-medium">F1-Score</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <div className="text-center">
            <div className="font-bold text-lg text-slate-700">{release.tp}</div>
            <div className="text-xs text-slate-500 font-medium">TP</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-slate-700">{release.tn}</div>
            <div className="text-xs text-slate-500 font-medium">TN</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-slate-700">{release.fp}</div>
            <div className="text-xs text-slate-500 font-medium">FP</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-slate-700">{release.fn}</div>
            <div className="text-xs text-slate-500 font-medium">FN</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          {release.trainingTime > 0 && (
            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Training:</span> {release.trainingTime} min/epoch
            </div>
          )}

          {release.modelFileName && (
            <div className="text-slate-600 bg-slate-50 p-3 rounded-lg">
              <span className="font-medium">Model File:</span> <span className="font-mono text-sm">{release.modelFileName}</span>
            </div>
          )}

          <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
            <span className="font-medium">Added:</span> {release.timestamp.toLocaleDateString()} at {release.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
