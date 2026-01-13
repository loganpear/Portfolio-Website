
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { BentoGrid, BentoItem } from './components/BentoGrid';
import { NavigationTab } from './types';
import { MOCK_PROJECTS } from './constants';
import { getResumeSummary, getResumeMetadata } from './services/geminiService';
import { Github, Linkedin, Twitter, ExternalLink, ArrowRight, BrainCircuit, Code, ChartBar, Loader2, FileText, AlertCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.HOME);
  const [isLoading, setIsLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiMetadata, setAiMetadata] = useState<{focus1: string, focus2: string, title: string} | null>(null);
  const [liveResume, setLiveResume] = useState<string>("");
  const [liveEssays, setLiveEssays] = useState<any[]>([]);
  const [errorStatus, setErrorStatus] = useState<{resume?: string, strategy?: string}>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Resume from API
        const resumeRes = await fetch('/api/resume');
        const resumeData = await resumeRes.json();

        if (!resumeRes.ok) {
          throw new Error(resumeData.error || 'Failed to fetch resume');
        }
        
        if (resumeData.body) {
          setLiveResume(resumeData.body);
          
          // Parallelize AI requests for efficiency
          const [summary, metadata] = await Promise.all([
            getResumeSummary(resumeData.body),
            getResumeMetadata(resumeData.body)
          ]);
          
          setAiSummary(summary);
          setAiMetadata(metadata);
        }
      } catch (err: any) {
        console.error("Resume fetch failed:", err);
        setErrorStatus(prev => ({ ...prev, resume: err.message }));
      }

      try {
        // Fetch Strategy Essays
        const strategyRes = await fetch('/api/strategy');
        const strategyData = await strategyRes.json();
        
        if (!strategyRes.ok) {
          throw new Error(strategyData.error || 'Failed to fetch strategy folder');
        }
        setLiveEssays(strategyData || []);
      } catch (err: any) {
        console.error("Strategy fetch failed:", err);
        setErrorStatus(prev => ({ ...prev, strategy: err.message }));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/${tab === 'home' ? '' : tab}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
        <p className="text-gray-500 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Connecting to Google Cloud...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.HOME:
        return (
          <BentoGrid className="max-w-6xl mx-auto px-4 py-12 pb-32">
            {/* Main Bio Tile */}
            <BentoItem colSpan={2} rowSpan={2} className="flex flex-col justify-between bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
              <div>
                <span className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles size={14} /> Personal Statement
                </span>
                <h2 className="text-4xl font-bold tracking-tighter mb-6 leading-tight text-white">
                  {aiMetadata?.title || "Professional Overview"} <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Synced via Drive.</span>
                </h2>
                <div className="min-h-[100px]">
                  {aiSummary ? (
                    <p className="text-gray-400 leading-relaxed text-lg italic transition-opacity duration-500">
                      "{aiSummary}"
                    </p>
                  ) : errorStatus.resume ? (
                    <p className="text-red-400/50 text-sm">Summary unavailable due to sync error.</p>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600 animate-pulse">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Generating grounded summary...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><Github size={20} /></a>
                <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><Linkedin size={20} /></a>
                <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><Twitter size={20} /></a>
              </div>
            </BentoItem>

            {/* Live Resume View Tile */}
            <BentoItem colSpan={2} rowSpan={2} className="bg-[#111] flex flex-col">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#111] py-2 z-10 border-b border-white/5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="text-blue-500" size={20} /> Live Resume
                </h3>
                <div className="flex items-center gap-2">
                  {errorStatus.resume ? (
                    <>
                      <AlertCircle className="text-red-500" size={14} />
                      <span className="text-red-500/70 text-[10px] font-bold uppercase tracking-tight">Sync Error</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Active Sync</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {errorStatus.resume ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-red-500/5 rounded-2xl border border-red-500/10">
                    <AlertCircle className="text-red-500 mb-2" size={32} />
                    <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-1">API Error</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {errorStatus.resume}
                    </p>
                    <div className="text-[10px] text-gray-600 bg-white/5 p-2 rounded border border-white/5 font-mono text-left w-full break-all">
                      Check: {process.env.RESUME_DOC_ID ? "ID Set" : "ID Missing"}<br/>
                      Shared with: vercel-integration@portfolioweb-484216.iam.gserviceaccount.com
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap font-mono opacity-80">
                    {liveResume || "Parsing Google Doc structure..."}
                  </div>
                )}
              </div>
            </BentoItem>

            {/* Dynamic Skill Tile 1 */}
            <BentoItem colSpan={1} className="flex flex-col justify-center items-center gap-4 bg-[#141414]">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Code className="text-purple-500" size={24} />
              </div>
              <div className="text-center">
                <div className="font-bold text-lg truncate w-full px-2">
                  {aiMetadata?.focus1 || "..."}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Core Tech</div>
              </div>
            </BentoItem>

            {/* Dynamic Skill Tile 2 */}
            <BentoItem colSpan={1} className="flex flex-col justify-center items-center gap-4 bg-[#141414]">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <ChartBar className="text-green-500" size={24} />
              </div>
              <div className="text-center">
                <div className="font-bold text-lg truncate w-full px-2">
                  {aiMetadata?.focus2 || "..."}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Specialization</div>
              </div>
            </BentoItem>

            {/* Strategy Drive Link Tile */}
            <BentoItem colSpan={2} className="flex items-center justify-between group cursor-pointer bg-blue-600/5 hover:bg-blue-600/10 border-blue-600/20" onClick={() => handleTabChange(NavigationTab.STRATEGY)}>
              <div className="flex items-center gap-6 px-4">
                <div className="text-3xl font-black italic text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                  {errorStatus.strategy ? "!" : (liveEssays.length || "0")}
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">Strategy Essays</h3>
                  <p className="text-gray-500 text-sm">{errorStatus.strategy ? "Folder sync error" : "Live case studies."}</p>
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
               <div className="flex justify-between items-end">
                 <div>
                   <span className="text-purple-500 font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Insights</span>
                   <h1 className="text-5xl font-black tracking-tighter">The Strategy Deck</h1>
                 </div>
                 <div className="text-[10px] font-bold text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                   {errorStatus.strategy ? <AlertCircle size={12} className="text-red-500" /> : <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                   DRIVE SYNC: {errorStatus.strategy ? "ERROR" : "ACTIVE"}
                 </div>
               </div>
               <p className="text-gray-500 mt-4 max-w-xl">
                 {errorStatus.strategy 
                   ? `Sync Failed: ${errorStatus.strategy}`
                   : "Real-time research papers and product teardowns automatically synced from Google Drive."}
               </p>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {liveEssays.length > 0 ? liveEssays.map((essay) => (
                  <BentoItem key={essay.id} colSpan={2} className="cursor-pointer group hover:border-purple-500/30">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black tracking-[0.2em] text-purple-500 uppercase px-2 py-1 bg-purple-500/10 rounded-md">
                        {new Date(essay.createdTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </span>
                      <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gray-700 group-hover:text-purple-500 group-hover:border-purple-500/30 transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 group-hover:text-purple-400 transition-colors tracking-tight">{essay.name}</h3>
                    <p className="text-gray-400 leading-relaxed text-lg line-clamp-2">{essay.description || "Analysis synced from Drive."}</p>
                  </BentoItem>
                )) : (
                  <div className="col-span-2 py-20 text-center border-2 border-dashed border-[#222] rounded-3xl">
                    <p className="text-gray-600 font-medium">No strategy docs found in folder.</p>
                  </div>
                )}
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-500 selection:text-white">
      <header className="max-w-6xl mx-auto px-4 py-10 flex justify-between items-center relative z-10">
        <div className="font-black text-2xl tracking-tighter flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange(NavigationTab.HOME)}>
           <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-600/20 uppercase">
             {aiMetadata?.title?.[0] || "LP"}
           </div>
           <span className="hidden sm:block uppercase tracking-tighter">Logan Pear</span>
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
      
      <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default App;
