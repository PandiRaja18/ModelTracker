
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ReleaseData } from "./ModuleForm";
import { Plus } from "lucide-react";

interface AddReleaseFormProps {
  moduleName: string;
  onSubmit: (data: ReleaseData) => void;
}

const architectureOptions = [
  "BERT", "CNN", "RNN", "LSTM", "GRU", "Transformer", 
  "SVM", "Random Forest", "Logistic Regression", "Custom"
];

export function AddReleaseForm({ moduleName, onSubmit }: AddReleaseFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
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
    
    if (!formData.version || !formData.description || !formData.accuracy || !formData.architecture) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
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
      accuracy: parseFloat(formData.accuracy),
      architecture: formData.architecture,
      tp: parseInt(formData.tp) || 0,
      tn: parseInt(formData.tn) || 0,
      fp: parseInt(formData.fp) || 0,
      fn: parseInt(formData.fn) || 0,
      trainingTime: parseFloat(formData.trainingTime) || 0,
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

    setOpen(false);
    
    toast({
      title: "Release Added",
      description: `Successfully added release ${formData.version} for ${moduleName}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Release
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Release - {moduleName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="modelFileName">Model File Name</Label>
              <Input
                id="modelFileName"
                placeholder="model_v1.2.0.pkl"
                value={formData.modelFileName}
                onChange={(e) => setFormData(prev => ({ ...prev, modelFileName: e.target.value }))}
              />
            </div>
          )}

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

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Add Release</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
