
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ModuleForm, ReleaseData } from "@/components/ModuleForm";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ComparisonDashboard } from "@/components/ComparisonDashboard";
import { CreateModuleForm } from "@/components/CreateModuleForm";
import { FilterBar } from "@/components/FilterBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Package, Clock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const defaultModules = [
  "Email Classification",
  "Sentence Classification", 
  "Webpage Classification",
  "URL Classification"
];

interface CustomModule {
  id: string;
  name: string;
  description: string;
  fields: string[];
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [releases, setReleases] = useState<ReleaseData[]>([]);
  const [customModules, setCustomModules] = useState<CustomModule[]>([]);
  const [filterModule, setFilterModule] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const allModules = [...defaultModules, ...customModules.map(m => m.name)];

  const handleAddRelease = (release: ReleaseData) => {
    setReleases(prev => [release, ...prev]);
  };

  const handleCreateModule = (module: CustomModule) => {
    setCustomModules(prev => [...prev, module]);
  };

  const filteredReleases = releases.filter(release => {
    const matchesModule = filterModule === "all" || release.module === filterModule;
    const matchesSearch = release.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderModuleSection = (moduleName: string) => {
    const moduleReleases = filteredReleases.filter(r => r.module === moduleName);
    const isOpen = openSections[moduleName] ?? true;

    return (
      <Collapsible 
        key={moduleName} 
        open={isOpen} 
        onOpenChange={() => toggleSection(moduleName)}
        className="space-y-4"
      >
        <CollapsibleTrigger className="w-full">
          <Card className="hover:shadow-sm transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-800">{moduleName}</h2>
                  <Badge variant="secondary">{moduleReleases.length} releases</Badge>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4">
          <ModuleForm moduleName={moduleName} onSubmit={handleAddRelease} />
          
          {moduleReleases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {moduleReleases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-500">No releases yet for {moduleName}</p>
                <p className="text-sm text-slate-400">Add your first release using the form above.</p>
              </CardContent>
            </Card>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderDashboard = () => {
    const totalReleases = releases.length;
    const moduleStats = allModules.map(module => ({
      name: module,
      count: releases.filter(r => r.module === module).length
    }));
    const avgAccuracy = releases.length > 0 
      ? (releases.reduce((sum, r) => sum + r.accuracy, 0) / releases.length * 100).toFixed(1)
      : "0";
    const recentReleases = releases.slice(0, 5);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalReleases}</p>
                  <p className="text-sm text-slate-600">Total Releases</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{allModules.length}</p>
                  <p className="text-sm text-slate-600">Active Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{avgAccuracy}%</p>
                  <p className="text-sm text-slate-600">Avg Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{customModules.length}</p>
                  <p className="text-sm text-slate-600">Custom Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {recentReleases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Releases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReleases.map((release) => (
                  <div key={release.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{release.module} {release.version}</p>
                      <p className="text-sm text-slate-600">{release.description.slice(0, 60)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-600">{(release.accuracy * 100).toFixed(1)}%</p>
                      <p className="text-xs text-slate-500">{release.timestamp.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <ComparisonDashboard releases={releases} modules={allModules} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="md:ml-64 p-4 md:p-8">
        {activeSection === "dashboard" && renderDashboard()}
        
        {activeSection === "create-module" && (
          <CreateModuleForm onCreateModule={handleCreateModule} />
        )}
        
        {defaultModules.includes(activeSection) && (
          <div className="space-y-6">
            <FilterBar
              modules={allModules}
              selectedModule={filterModule}
              onModuleChange={setFilterModule}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearFilters={() => {
                setFilterModule("all");
                setSearchTerm("");
              }}
            />
            {renderModuleSection(activeSection)}
          </div>
        )}

        {customModules.some(m => m.name === activeSection) && (
          <div className="space-y-6">
            <FilterBar
              modules={allModules}
              selectedModule={filterModule}
              onModuleChange={setFilterModule}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearFilters={() => {
                setFilterModule("all");
                setSearchTerm("");
              }}
            />
            {renderModuleSection(activeSection)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
