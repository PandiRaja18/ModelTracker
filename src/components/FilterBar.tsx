
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  modules: string[];
  selectedModule: string;
  onModuleChange: (module: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({ 
  modules, 
  selectedModule, 
  onModuleChange, 
  searchTerm, 
  onSearchChange, 
  onClearFilters 
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search releases..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={selectedModule} onValueChange={onModuleChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>{module}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onClearFilters}>
          <Filter className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
}
