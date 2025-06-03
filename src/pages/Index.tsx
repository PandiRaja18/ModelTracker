import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ReleaseData } from "@/components/ModuleForm";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ComparisonDashboard } from "@/components/ComparisonDashboard";
import { CreateModuleForm } from "@/components/CreateModuleForm";
import { FilterBar } from "@/components/FilterBar";
import { AddReleaseForm } from "@/components/AddReleaseForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Package, Clock, Sparkles } from "lucide-react";
import { VersionDetailsDropdown } from "@/components/VersionDetailsDropdown";

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

  const allModules = [...defaultModules, ...customModules.map(m => m.name)];

  const handleAddRelease = (release: ReleaseData) => {
    setReleases(prev => [release, ...prev]);
  };

  const handleUpdateRelease = (updatedRelease: ReleaseData) => {
    setReleases(prev => prev.map(release => 
      release.id === updatedRelease.id ? updatedRelease : release
    ));
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

  const renderModuleSection = (moduleName: string) => {
    const moduleReleases = filteredReleases.filter(r => r.module === moduleName);
    const latestRelease = moduleReleases[0];
    const avgAccuracy = moduleReleases.length > 0 
      ? (moduleReleases.reduce((sum, r) => sum + r.accuracy, 0) / moduleReleases.length * 100).toFixed(1)
      : "0";

    return (
      <div className="space-y-8">
        {/* Module Header Card */}
        <Card className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{moduleName}</h1>
                  <p className="text-slate-600">Machine Learning Module</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{moduleReleases.length}</div>
                  <div className="text-sm text-slate-600">Releases</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{avgAccuracy}%</div>
                  <div className="text-sm text-slate-600">Avg Accuracy</div>
                </div>
                <AddReleaseForm moduleName={moduleName} onSubmit={handleAddRelease} />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Latest Release Highlight */}
        {latestRelease && (
          <Card className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-200 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-lg text-emerald-800">Latest Release</CardTitle>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                  {latestRelease.version}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-3">{latestRelease.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600">Architecture: {latestRelease.architecture}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-600">Released: {latestRelease.timestamp.toLocaleDateString()}</span>
                </div>
                {latestRelease.modelUpdate && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-slate-600">Accuracy: {(latestRelease.accuracy * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Version History */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-600" />
            Version History
          </h2>
          
          {moduleReleases.length > 0 ? (
            <div className="space-y-4">
              {moduleReleases.map((release) => (
                <VersionDetailsDropdown
                  key={release.id} 
                  release={release} 
                  onUpdate={handleUpdateRelease}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-slate-300">
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No releases yet</h3>
                <p className="text-slate-500 mb-6">Get started by creating your first release for {moduleName}</p>
                <AddReleaseForm moduleName={moduleName} onSubmit={handleAddRelease} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            ML Release Tracker
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Manage and track your machine learning model releases with comprehensive metrics and version history
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-700">{totalReleases}</p>
                  <p className="text-sm text-blue-600 font-medium">Total Releases</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-700">{allModules.length}</p>
                  <p className="text-sm text-emerald-600 font-medium">Active Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-700">{avgAccuracy}%</p>
                  <p className="text-sm text-purple-600 font-medium">Avg Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-700">{customModules.length}</p>
                  <p className="text-sm text-orange-600 font-medium">Custom Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentReleases.length > 0 && (
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentReleases.map((release, index) => (
                  <div key={release.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-emerald-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          index === 2 ? 'bg-purple-500' : 'bg-slate-400'
                        }`}>
                          v{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{release.module} {release.version}</p>
                          <p className="text-sm text-slate-600 max-w-md truncate">{release.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">{(release.accuracy * 100).toFixed(1)}%</p>
                        <p className="text-xs text-slate-500">{release.timestamp.toLocaleDateString()}</p>
                      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="md:ml-64 p-6 md:p-10">
        {activeSection === "dashboard" && renderDashboard()}
        
        {activeSection === "create-module" && (
          <div className="max-w-4xl mx-auto">
            <CreateModuleForm onCreateModule={handleCreateModule} />
          </div>
        )}
        
        {(defaultModules.includes(activeSection) || customModules.some(m => m.name === activeSection)) && (
          <div className="max-w-6xl mx-auto space-y-8">
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
