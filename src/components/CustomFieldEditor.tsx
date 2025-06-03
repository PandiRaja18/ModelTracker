
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Edit } from "lucide-react";

interface CustomFieldEditorProps {
  fields: string[];
  onFieldsUpdate: (fields: string[]) => void;
}

export function CustomFieldEditor({ fields, onFieldsUpdate }: CustomFieldEditorProps) {
  const { toast } = useToast();
  const [newField, setNewField] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addField = () => {
    if (newField.trim() && !fields.includes(newField.trim())) {
      onFieldsUpdate([...fields, newField.trim()]);
      setNewField("");
      toast({
        title: "Field Added",
        description: `Successfully added field: ${newField.trim()}`,
      });
    }
  };

  const removeField = (field: string) => {
    onFieldsUpdate(fields.filter(f => f !== field));
    toast({
      title: "Field Removed",
      description: `Removed field: ${field}`,
    });
  };

  const startEditing = (field: string) => {
    setEditingField(field);
    setEditingValue(field);
  };

  const saveEdit = () => {
    if (editingValue.trim() && !fields.includes(editingValue.trim())) {
      const updatedFields = fields.map(f => f === editingField ? editingValue.trim() : f);
      onFieldsUpdate(updatedFields);
      setEditingField(null);
      setEditingValue("");
      toast({
        title: "Field Updated",
        description: `Successfully updated field`,
      });
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditingValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-slate-800">Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter custom field name"
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addField())}
          />
          <Button type="button" onClick={addField} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {fields.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Fields:</Label>
            <div className="space-y-2">
              {fields.map((field) => (
                <div key={field} className="flex items-center gap-2 p-2 bg-slate-50 rounded border">
                  {editingField === field ? (
                    <>
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      />
                      <Button onClick={saveEdit} size="sm" variant="outline">
                        Save
                      </Button>
                      <Button onClick={cancelEdit} size="sm" variant="outline">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm">{field}</span>
                      <Button
                        onClick={() => startEditing(field)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => removeField(field)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
