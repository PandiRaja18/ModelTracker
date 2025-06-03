
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReleaseData } from "./ModuleForm";
import { ChevronDown, Target, CheckCircle, Clock } from "lucide-react";
import { EditReleaseDialog } from "./EditReleaseDialog";

interface VersionDetailsDropdownProps {
  release: ReleaseData;
  onUpdate: (updatedRelease: ReleaseData) => void;
}

export function VersionDetailsDropdown({ release, onUpdate }: VersionDetailsDropdownProps) {
  const precision = release.tp + release.fp > 0 ? (release.tp / (release.tp + release.fp)).toFixed(3) : "N/A";
  const recall = release.tp + release.fn > 0 ? (release.tp / (release.tp + release.fn)).toFixed(3) : "N/A";
  const f1Score = precision !== "N/A" && recall !== "N/A" 
    ? (2 * (parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall))).toFixed(3)
    : "N/A";

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="font-semibold text-lg text-slate-800">{release.version}</span>
          {release.modelUpdate && (
            <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Updated
            </Badge>
          )}
        </div>
        <div className="text-sm text-slate-600">
          {release.timestamp.toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <EditReleaseDialog release={release} onUpdate={onUpdate} />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Details <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 p-0 bg-white border border-slate-200 shadow-lg" align="end">
            <Card className="border-0 shadow-none">
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-slate-700 mb-3 leading-relaxed">{release.description}</p>
                </div>

                {release.modelUpdate && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <Target className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                        <div className="text-lg font-bold text-blue-700">
                          {(release.accuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-blue-600 font-medium">Accuracy</div>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                        <div className="text-lg font-bold text-emerald-700">{precision}</div>
                        <div className="text-xs text-emerald-600 font-medium">Precision</div>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <div className="text-lg font-bold text-purple-700">{recall}</div>
                        <div className="text-xs text-purple-600 font-medium">Recall</div>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="text-lg font-bold text-orange-700">{f1Score}</div>
                        <div className="text-xs text-orange-600 font-medium">F1-Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                      <div className="text-center">
                        <div className="font-bold text-base text-slate-700">{release.tp}</div>
                        <div className="text-xs text-slate-500 font-medium">TP</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-base text-slate-700">{release.tn}</div>
                        <div className="text-xs text-slate-500 font-medium">TN</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-base text-slate-700">{release.fp}</div>
                        <div className="text-xs text-slate-500 font-medium">FP</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-base text-slate-700">{release.fn}</div>
                        <div className="text-xs text-slate-500 font-medium">FN</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                        <span className="font-medium">Architecture:</span> {release.architecture}
                      </div>
                      
                      {release.trainingTime > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="font-medium">Training:</span> {release.trainingTime} min/epoch
                        </div>
                      )}

                      {release.modelFileName && (
                        <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                          <span className="font-medium">Model File:</span> <span className="font-mono text-xs">{release.modelFileName}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
