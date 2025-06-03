
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CustomFieldEditor } from "./CustomFieldEditor";

interface CustomModule {
  id: string;
  name: string;
  description: string;
  fields: string[];
}

interface CreateModuleFormProps {
  onCreateModule: (module: CustomModule) => void;
}

const defaultFields = [
  "Version Number",
  "Change Description", 
  "Model Update Flag",
  "Model File Name",
  "Accuracy",
  "Architecture",
  "TP", "TN", "FP", "FN",
  "Training Time per Epoch"
];

export function CreateModuleForm({ onCreateModule }: CreateModuleFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedFields, setSelectedFields] = useState<string[]>(defaultFields);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a module name.",
        variant: "destructive",
      });
      return;
    }

    const newModule: CustomModule = {
      id: `custom-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      fields: selectedFields,
    };

    onCreateModule(newModule);
    
    // Reset form
    setFormData({ name: "", description: "" });
    setSelectedFields(defaultFields);
    
    toast({
      title: "Module Created",
      description: `Successfully created module: ${formData.name}`,
    });
  };

  const toggleDefaultField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-slate-800">Create Custom Module</CardTitle>
          <p className="text-sm text-slate-600">
            Design your own ML module with custom fields and tracking requirements.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="moduleName">Module Name *</Label>
              <Input
                id="moduleName"
                placeholder="e.g., Custom Image Classification"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moduleDescription">Description</Label>
              <Textarea
                id="moduleDescription"
                placeholder="Describe what this module will track..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Default Fields</Label>
                <p className="text-sm text-slate-600 mb-3">
                  Select which standard fields to include in your module:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {defaultFields.map((field) => (
                    <label key={field} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field)}
                        onChange={() => toggleDefaultField(field)}
                        className="rounded border-slate-300"
                      />
                      <span>{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Module
            </Button>
          </form>
        </CardContent>
      </Card>

      <CustomFieldEditor 
        fields={selectedFields.filter(f => !defaultFields.includes(f))} 
        onFieldsUpdate={(customFields) => {
          const defaultSelected = selectedFields.filter(f => defaultFields.includes(f));
          setSelectedFields([...defaultSelected, ...customFields]);
        }}
      />
    </div>
  );
}
