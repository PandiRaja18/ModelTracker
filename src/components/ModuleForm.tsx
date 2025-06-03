
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export interface ReleaseData {
  id: string;
  module: string;
  version: string;
  description: string;
  modelUpdate: boolean;
  modelFileName?: string;
  accuracy: number;
  architecture: string;
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  trainingTime: number;
  timestamp: Date;
}

interface ModuleFormProps {
  moduleName: string;
  onSubmit: (data: ReleaseData) => void;
}

const architectureOptions = [
  "BERT", "CNN", "RNN", "LSTM", "GRU", "Transformer", 
  "SVM", "Random Forest", "Logistic Regression", "Custom"
];

export function ModuleForm({ moduleName, onSubmit }: ModuleFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    version: "",
    description: "",
    modelUpdate: false,
    modelFileName: "",
    accuracy: "",
    architecture: "",
    tp: "",
    tn: "",
    fp: "",
    fn: "",
    trainingTime: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.version || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in version and description fields.",
        variant: "destructive",
      });
      return;
    }

    // Only validate model-related fields if model update is checked
    if (formData.modelUpdate && (!formData.accuracy || !formData.architecture)) {
      toast({
        title: "Validation Error",
        description: "Please fill in accuracy and architecture for model updates.",
        variant: "destructive",
      });
      return;
    }

    const releaseData: ReleaseData = {
      id: `${moduleName}-${Date.now()}`,
      module: moduleName,
      version: formData.version,
      description: formData.description,
      modelUpdate: formData.modelUpdate,
      modelFileName: formData.modelFileName,
      accuracy: formData.modelUpdate ? parseFloat(formData.accuracy) : 0,
      architecture: formData.modelUpdate ? formData.architecture : "",
      tp: formData.modelUpdate ? (parseInt(formData.tp) || 0) : 0,
      tn: formData.modelUpdate ? (parseInt(formData.tn) || 0) : 0,
      fp: formData.modelUpdate ? (parseInt(formData.fp) || 0) : 0,
      fn: formData.modelUpdate ? (parseInt(formData.fn) || 0) : 0,
      trainingTime: formData.modelUpdate ? (parseFloat(formData.trainingTime) || 0) : 0,
      timestamp: new Date(),
    };

    onSubmit(releaseData);
    
    // Reset form
    setFormData({
      version: "",
      description: "",
      modelUpdate: false,
      modelFileName: "",
      accuracy: "",
      architecture: "",
      tp: "",
      tn: "",
      fp: "",
      fn: "",
      trainingTime: "",
    });

    toast({
      title: "Release Added",
      description: `Successfully added release ${formData.version} for ${moduleName}`,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-slate-800">
          Add New Release - {moduleName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version Number *</Label>
              <Input
                id="version"
                placeholder="e.g., v1.2.0"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Change Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the changes and improvements in this release..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="modelUpdate"
              checked={formData.modelUpdate}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, modelUpdate: checked as boolean }))
              }
            />
            <Label htmlFor="modelUpdate">Model Update</Label>
          </div>

          {formData.modelUpdate && (
            <>
              <div className="space-y-2">
                <Label htmlFor="modelFileName">Model File Name</Label>
                <Input
                  id="modelFileName"
                  placeholder="model_v1.2.0.pkl"
                  value={formData.modelFileName}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelFileName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accuracy">Accuracy *</Label>
                  <Input
                    id="accuracy"
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    placeholder="0.95"
                    value={formData.accuracy}
                    onChange={(e) => setFormData(prev => ({ ...prev, accuracy: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="architecture">Architecture *</Label>
                  <Select 
                    value={formData.architecture} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, architecture: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select architecture" />
                    </SelectTrigger>
                    <SelectContent>
                      {architectureOptions.map((arch) => (
                        <SelectItem key={arch} value={arch}>{arch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tp">True Positives</Label>
                  <Input
                    id="tp"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.tp}
                    onChange={(e) => setFormData(prev => ({ ...prev, tp: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tn">True Negatives</Label>
                  <Input
                    id="tn"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.tn}
                    onChange={(e) => setFormData(prev => ({ ...prev, tn: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fp">False Positives</Label>
                  <Input
                    id="fp"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.fp}
                    onChange={(e) => setFormData(prev => ({ ...prev, fp: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fn">False Negatives</Label>
                  <Input
                    id="fn"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.fn}
                    onChange={(e) => setFormData(prev => ({ ...prev, fn: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainingTime">Training Time per Epoch (minutes)</Label>
                <Input
                  id="trainingTime"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.5"
                  value={formData.trainingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, trainingTime: e.target.value }))}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            Add Release
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
