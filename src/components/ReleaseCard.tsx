
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReleaseData } from "./ModuleForm";
import { CheckCircle, Clock, Target, Zap } from "lucide-react";

interface ReleaseCardProps {
  release: ReleaseData;
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  const precision = release.tp + release.fp > 0 ? (release.tp / (release.tp + release.fp)).toFixed(3) : "N/A";
  const recall = release.tp + release.fn > 0 ? (release.tp / (release.tp + release.fn)).toFixed(3) : "N/A";
  const f1Score = precision !== "N/A" && recall !== "N/A" 
    ? (2 * (parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall))).toFixed(3)
    : "N/A";

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-800">{release.version}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{release.architecture}</Badge>
            {release.modelUpdate && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Model Updated
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-2">{release.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Target className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <div className="text-lg font-semibold text-blue-700">
              {(release.accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-blue-600">Accuracy</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-700">{precision}</div>
            <div className="text-xs text-green-600">Precision</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-700">{recall}</div>
            <div className="text-xs text-purple-600">Recall</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-semibold text-orange-700">{f1Score}</div>
            <div className="text-xs text-orange-600">F1-Score</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium text-slate-700">{release.tp}</div>
            <div className="text-xs text-slate-500">TP</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium text-slate-700">{release.tn}</div>
            <div className="text-xs text-slate-500">TN</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium text-slate-700">{release.fp}</div>
            <div className="text-xs text-slate-500">FP</div>
          </div>
          <div className="p-2 bg-slate-50 rounded">
            <div className="font-medium text-slate-700">{release.fn}</div>
            <div className="text-xs text-slate-500">FN</div>
          </div>
        </div>

        {release.trainingTime > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            Training: {release.trainingTime} min/epoch
          </div>
        )}

        {release.modelFileName && (
          <div className="text-sm text-slate-600">
            <strong>Model File:</strong> {release.modelFileName}
          </div>
        )}

        <div className="text-xs text-slate-400">
          Added: {release.timestamp.toLocaleDateString()} at {release.timestamp.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
