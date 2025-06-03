
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ReleaseData } from "./ModuleForm";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

interface ComparisonDashboardProps {
  releases: ReleaseData[];
  modules: string[];
}

export function ComparisonDashboard({ releases, modules }: ComparisonDashboardProps) {
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [metricView, setMetricView] = useState<"combined" | "individual" | "single">("combined");
  const [singleMetric, setSingleMetric] = useState<"tp" | "tn" | "fp" | "fn" | "accuracy" | "precision" | "recall">("accuracy");

  const filteredReleases = selectedModule 
    ? releases.filter(r => r.module === selectedModule)
    : [];

  const chartData = filteredReleases.map(release => {
    const precision = release.tp + release.fp > 0 ? ((release.tp / (release.tp + release.fp)) * 100) : 0;
    const recall = release.tp + release.fn > 0 ? ((release.tp / (release.tp + release.fn)) * 100) : 0;
    
    return {
      version: release.version,
      accuracy: (release.accuracy * 100),
      precision: precision,
      recall: recall,
      tp: release.tp,
      tn: release.tn,
      fp: release.fp,
      fn: release.fn,
    };
  });

  const renderChart = () => {
    if (!selectedModule || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-slate-500">
          Select a module to view comparison charts
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    if (metricView === "combined") {
      if (chartType === "bar") {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy %" />
              <Bar dataKey="precision" fill="#10b981" name="Precision %" />
              <Bar dataKey="recall" fill="#8b5cf6" name="Recall %" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" name="Accuracy %" strokeWidth={2} />
              <Line type="monotone" dataKey="precision" stroke="#10b981" name="Precision %" strokeWidth={2} />
              <Line type="monotone" dataKey="recall" stroke="#8b5cf6" name="Recall %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
    } else if (metricView === "individual") {
      if (chartType === "bar") {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tp" fill="#22c55e" name="True Positives" />
              <Bar dataKey="tn" fill="#3b82f6" name="True Negatives" />
              <Bar dataKey="fp" fill="#f59e0b" name="False Positives" />
              <Bar dataKey="fn" fill="#ef4444" name="False Negatives" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tp" stroke="#22c55e" name="True Positives" strokeWidth={2} />
              <Line type="monotone" dataKey="tn" stroke="#3b82f6" name="True Negatives" strokeWidth={2} />
              <Line type="monotone" dataKey="fp" stroke="#f59e0b" name="False Positives" strokeWidth={2} />
              <Line type="monotone" dataKey="fn" stroke="#ef4444" name="False Negatives" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
    } else {
      // Single metric view
      const metricColors = {
        tp: "#22c55e",
        tn: "#3b82f6", 
        fp: "#f59e0b",
        fn: "#ef4444",
        accuracy: "#8b5cf6",
        precision: "#10b981",
        recall: "#f97316"
      };

      const metricNames = {
        tp: "True Positives",
        tn: "True Negatives",
        fp: "False Positives", 
        fn: "False Negatives",
        accuracy: "Accuracy %",
        precision: "Precision %",
        recall: "Recall %"
      };

      if (chartType === "bar") {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={singleMetric} fill={metricColors[singleMetric]} name={metricNames[singleMetric]} />
            </BarChart>
          </ResponsiveContainer>
        );
      } else {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={singleMetric} 
                stroke={metricColors[singleMetric]} 
                name={metricNames[singleMetric]} 
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-slate-800">Comparison Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Module</label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Chart Type</label>
              <Select value={chartType} onValueChange={(value: "bar" | "line") => setChartType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Metric View</label>
              <Select value={metricView} onValueChange={(value: "combined" | "individual" | "single") => setMetricView(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="combined">Performance Metrics</SelectItem>
                  <SelectItem value="individual">Confusion Matrix</SelectItem>
                  <SelectItem value="single">Single Metric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {metricView === "single" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Single Metric</label>
                <Select value={singleMetric} onValueChange={(value: typeof singleMetric) => setSingleMetric(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                    <SelectItem value="precision">Precision</SelectItem>
                    <SelectItem value="recall">Recall</SelectItem>
                    <SelectItem value="tp">True Positives</SelectItem>
                    <SelectItem value="tn">True Negatives</SelectItem>
                    <SelectItem value="fp">False Positives</SelectItem>
                    <SelectItem value="fn">False Negatives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedModule("");
                  setChartType("bar");
                  setMetricView("combined");
                  setSingleMetric("accuracy");
                }}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            {renderChart()}
          </div>

          {selectedModule && chartData.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{chartData.length}</div>
                  <div className="text-sm text-slate-600">Total Releases</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.max(...chartData.map(d => d.accuracy)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-600">Best Accuracy</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {chartData[chartData.length - 1]?.version || "N/A"}
                  </div>
                  <div className="text-sm text-slate-600">Latest Version</div>
                </div>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
