
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { BentoGrid, BentoItem } from './components/BentoGrid';
import { NavigationTab } from './types';
import { MOCK_PROJECTS, MOCK_EXPERIENCE, MOCK_ESSAYS } from './constants';
import { getResumeSummary } from './services/geminiService';
import { Github, Linkedin, Twitter, ExternalLink, ArrowRight, BrainCircuit, Code, ChartBar, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.HOME);
  const [isLoading, setIsLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        // In production, this data would come from your /api/resume endpoint
        // which calls lib/google-docs.ts
        const mockResumeContent = "Senior SWE and Data Science student with expertise in Rust, Python, and Product Strategy. Previously interned at TechCorp.";
        const summary = await getResumeSummary(mockResumeContent);
        setAiSummary(summary);
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  // Sync state with URL if possible (simulated routing)
  useEffect(() => {
    const path = window.location.pathname.replace('/', '') as NavigationTab;
    if (Object.values(NavigationTab).includes(path)) {
      setActiveTab(path);
    }
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/${tab === 'home' ? '' : tab}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Building your experience...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.HOME:
        return (
          <BentoGrid className="max-w-6xl mx-auto px-4 py-12 pb-32">
            {/* Story Tile */}
            <BentoItem colSpan={2} rowSpan={2} className="flex flex-col justify-between bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
              <div>
                <span className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-4 block">About Me</span>
                <h2 className="text-4xl font-bold tracking-tighter mb-6 leading-tight text-white">
                  Solving complex problems with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">code and data.</span>
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {aiSummary || "I bridge the gap between technical infrastructure and strategic market insights. Currently building tools at the intersection of performance engineering and predictive analytics."}
                </p>
              </div>
              <div className="flex gap-4 mt-8">
                <a href="https://github.com" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><Github size={20} /></a>
                <a href="https://linkedin.com" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><Linkedin size={20} /></a>
                <a href="https://twitter.com" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><Twitter size={20} /></a>
              </div>
            </BentoItem>

            {/* Experience Tile - Pulls from "Single Source of Truth" */}
            <BentoItem colSpan={2} rowSpan={2} className="bg-[#111]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BrainCircuit className="text-blue-500" size={20} /> Career Path
                </h3>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-full uppercase">Live Sync</span>
              </div>
              <div className="space-y-8">
                {MOCK_EXPERIENCE.map((exp, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{exp.role}</h4>
                        <p className="text-sm text-gray-500 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 border border-gray-800 px-2 py-0.5 rounded uppercase tracking-tighter">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </BentoItem>

            {/* Tech Stack Tiles */}
            <BentoItem colSpan={1} className="flex flex-col justify-center items-center gap-4 bg-[#141414]">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Code className="text-purple-500" size={24} />
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Engineering</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Rust • TS • Go</div>
              </div>
            </BentoItem>

            <BentoItem colSpan={1} className="flex flex-col justify-center items-center gap-4 bg-[#141414]">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <ChartBar className="text-green-500" size={24} />
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">94% AUC</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">SOTA Performance</div>
              </div>
            </BentoItem>

            {/* CTA Tile */}
            <BentoItem colSpan={2} className="flex items-center justify-between group cursor-pointer bg-blue-600/5 hover:bg-blue-600/10 border-blue-600/20" onClick={() => handleTabChange(NavigationTab.SWE)}>
              <div className="flex items-center gap-6 px-4">
                <div className="text-3xl font-black italic text-blue-500/20 group-hover:text-blue-500/40 transition-colors">01</div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">Explore Projects</h3>
                  <p className="text-gray-500 text-sm">Deep dive into my technical architecture.</p>
                </div>
              </div>
              <div className="mr-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                <ArrowRight size={20} className="text-white" />
              </div>
            </BentoItem>
          </BentoGrid>
        );

      case NavigationTab.SWE:
      case NavigationTab.DS:
        const cat = activeTab === NavigationTab.SWE ? 'swe' : 'data-science';
        const filteredProjects = MOCK_PROJECTS.filter(p => p.category === cat);
        return (
          <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
             <header className="mb-12">
               <span className="text-blue-500 font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Portfolio</span>
               <h1 className="text-5xl font-black tracking-tighter capitalize">{activeTab.replace('-', ' ')}</h1>
             </header>
             <BentoGrid className="auto-rows-[auto]">
               {filteredProjects.map((project) => (
                 <BentoItem key={project.id} colSpan={2} className="flex flex-col justify-between min-h-[300px]">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-3xl font-bold tracking-tight">{project.title}</h3>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                            <ExternalLink size={20} className="text-blue-500" />
                          </a>
                        )}
                      </div>
                      <p className="text-gray-400 text-lg leading-relaxed mb-8">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400 border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                 </BentoItem>
               ))}
             </BentoGrid>
          </div>
        );

      case NavigationTab.STRATEGY:
        return (
          <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
             <header className="mb-12">
               <span className="text-purple-500 font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Essays & Market Strategy</span>
               <h1 className="text-5xl font-black tracking-tighter">The Strategy Deck</h1>
               <p className="text-gray-500 mt-4 max-w-xl">A collection of research papers and product teardowns automatically synced from my personal Google Drive.</p>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {MOCK_ESSAYS.map((essay) => (
                  <BentoItem key={essay.id} colSpan={2} className="cursor-pointer group hover:border-purple-500/30">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black tracking-[0.2em] text-purple-500 uppercase px-2 py-1 bg-purple-500/10 rounded-md">{essay.date}</span>
                      <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-700 group-hover:text-purple-500 group-hover:border-purple-500/30 transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 group-hover:text-purple-400 transition-colors tracking-tight">{essay.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-lg line-clamp-2">{essay.excerpt}</p>
                  </BentoItem>
                ))}
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-500 selection:text-white">
      <header className="max-w-6xl mx-auto px-4 py-10 flex justify-between items-center relative z-10">
        <div className="font-black text-2xl tracking-tighter flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange(NavigationTab.HOME)}>
           <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-600/20">JD</div>
           <span className="hidden sm:block">JONATHAN DOE</span>
        </div>
        <div className="flex gap-8 text-xs font-black tracking-[0.2em] text-gray-500 uppercase">
          <button className="hover:text-white transition-colors" onClick={() => handleTabChange(NavigationTab.HOME)}>About</button>
          <button className="hover:text-white transition-colors" onClick={() => handleTabChange(NavigationTab.SWE)}>Work</button>
          <a href="mailto:hello@example.com" className="hover:text-white transition-colors">Contact</a>
        </div>
      </header>

      <main className="transition-all duration-700 ease-in-out">
        {renderContent()}
      </main>

      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Subtle Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default App;
