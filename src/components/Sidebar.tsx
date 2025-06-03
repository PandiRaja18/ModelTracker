
import { useState } from "react";
import { 
  Mail, 
  Type, 
  Globe, 
  Link, 
  Plus, 
  BarChart3, 
  FileText,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const modules = [
  { id: "Email Classification", name: "Email Classification", icon: Mail },
  { id: "Sentence Classification", name: "Sentence Classification", icon: Type },
  { id: "Webpage Classification", name: "Webpage Classification", icon: Globe },
  { id: "URL Classification", name: "URL Classification", icon: Link },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800">ML Tracker</h1>
        <p className="text-sm text-slate-600 mt-1">Release & Milestone Manager</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <Button
            variant={activeSection === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={() => {
              onSectionChange("dashboard");
              setIsOpen(false);
            }}
          >
            <BarChart3 className="mr-3 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeSection === "create-module" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              onSectionChange("create-module");
              setIsOpen(false);
            }}
          >
            <Plus className="mr-3 h-4 w-4" />
            Create Module
          </Button>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            ML Modules
          </h3>
          {modules.map((module) => (
            <Button
              key={module.id}
              variant={activeSection === module.id ? "default" : "ghost"}
              className="w-full justify-start mb-1"
              onClick={() => {
                onSectionChange(module.id);
                setIsOpen(false);
              }}
            >
              <module.icon className="mr-3 h-4 w-4" />
              {module.name}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 h-screen fixed left-0 top-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
