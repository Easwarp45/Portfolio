'use client';

import React, { useEffect, useState } from 'react';
import { 
  Terminal, Mail, Cpu, FolderGit2, Send, Orbit, 
  X, ExternalLink, BarChart3, ShieldAlert, CheckCircle2, ChevronRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { TechNode, techNodes } from '../canvas/SystemArchitecture';
import { ProjectData, projectsData } from '../canvas/DeploymentContainers';

interface OverlayHUDProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedNode: TechNode | null;
  setSelectedNode: (node: TechNode | null) => void;
  selectedProject: ProjectData | null;
  setSelectedProject: (project: ProjectData | null) => void;
  isTransmitting: boolean;
  setIsTransmitting: (status: boolean) => void;
  scanPercentage: number;
}

export default function OverlayHUD({
  activeSection,
  setActiveSection,
  selectedNode,
  setSelectedNode,
  selectedProject,
  setSelectedProject,
  isTransmitting,
  setIsTransmitting,
  scanPercentage
}: OverlayHUDProps) {
  const [timeStr, setTimeStr] = useState('');
  const [frameRate, setFrameRate] = useState(60);
  const [systemTemp, setSystemTemp] = useState(36.2);

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<{
    packetId: string;
    timestamp: string;
    message: string;
  } | null>(null);

  // Live telemetry temperature ticks
  useEffect(() => {
    const tempInterval = setInterval(() => {
      setSystemTemp(() => Number((35.0 + Math.random() * 3.2).toFixed(1)));
    }, 3000);
    return () => clearInterval(tempInterval);
  }, []);

  // Update clock time
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate floating FPS values for scifi authenticity
  useEffect(() => {
    const fpsInterval = setInterval(() => {
      setFrameRate(() => Math.floor(Math.random() * 4) + 57);
    }, 1200);
    return () => clearInterval(fpsInterval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Core Overview', icon: Orbit },
    { id: 'about', label: 'Stack Graph', icon: Cpu },
    { id: 'projects', label: 'Project Pods', icon: FolderGit2 },
    { id: 'contact', label: 'API Gateway', icon: Send }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessResponse(null);

    // Form validation
    if (!name.trim()) {
      setErrorMsg('> ERROR: INVALID_PAYLOAD. IDENTITY NAME REQUIRED.');
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setErrorMsg('> ERROR: INVALID_PAYLOAD. ROUTING EMAIL REQUIRED.');
      setLoading(false);
      return;
    }
    if (!message.trim()) {
      setErrorMsg('> ERROR: INVALID_PAYLOAD. PAYLOAD MESSAGE REQUIRED.');
      setLoading(false);
      return;
    }
    if (name.trim().length < 2) {
      setErrorMsg('> ERROR: IDENTITY_CHECK_FAILED. Name must be at least 2 characters.');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('> ERROR: ROUTING_CHECK_FAILED. Enter a valid email routing address.');
      setLoading(false);
      return;
    }
    if (message.trim().length < 10) {
      setErrorMsg('> ERROR: PAYLOAD_SIZE_INSUFFICIENT. Message must be at least 10 characters.');
      setLoading(false);
      return;
    }

    setIsTransmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gateway connection lost during relay.');
      }

      setSuccessResponse(data);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Transmission failed. Connection timed out.');
      setIsTransmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const getCoordinates = () => {
    switch (activeSection) {
      case 'home': return '[0.00, 0.00, 7.00]';
      case 'about': return '[14.0, 3.00, 8.00]';
      case 'projects': return '[-14.0, 2.00, 8.0]';
      case 'contact': return '[0.00, -15.0, 7.0]';
      default: return '[0.00, 0.00, 0.00]';
    }
  };

  return (
    <>
      {/* 1. TOP SYSTEM BAR (Floating, Bounded) */}
      <header className="fixed top-4 left-4 right-4 z-30 pointer-events-auto bg-slate-950/80 border border-cyber-cyan/20 backdrop-blur-md rounded px-6 py-3.5 flex items-center justify-between font-mono select-none shadow-2xl">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan/50" />
        
        {/* Logo brand */}
        <div className="flex items-center gap-2 border border-cyber-cyan/25 bg-slate-900/60 px-4 py-1.5 rounded relative shadow-[0_0_8px_rgba(0,240,255,0.1)]">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyber-cyan" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyber-cyan" />
          <Terminal className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <span className="text-xs md:text-sm font-bold tracking-widest text-white text-glow-cyan uppercase">
            EASWARAMURTHY <span className="text-cyber-cyan">P</span>
          </span>
        </div>

        {/* Diagnostic telemetry clock */}
        <div className="flex items-center gap-4 text-xs text-cyber-cyan/80">
          <div className="hidden md:flex items-center gap-2 border-r border-cyber-cyan/20 pr-4">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span>DIAGNOSTIC_STATE: OPERATIONAL</span>
          </div>
          <div className="hidden sm:block">FPS: <span className="text-white text-glow-cyan font-bold">{frameRate}</span></div>
          <div className="bg-slate-950/60 border border-cyber-cyan/20 px-3 py-1 rounded text-white text-glow-cyan">
            {timeStr} <span className="text-cyber-cyan/40 text-[9px]">GMT+0530</span>
          </div>
        </div>
      </header>

      {/* 2. LEFT SIDEBAR NAVIGATION (Vertical perfectly aligned icons) */}
      <nav className="fixed left-4 top-20 bottom-20 w-20 md:w-24 z-20 flex flex-col items-center justify-between border border-cyber-cyan/20 bg-slate-950/80 backdrop-blur-md rounded py-10 px-3 select-none pointer-events-auto shadow-2xl">
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyber-cyan/50" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyber-cyan/50" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyber-cyan/50" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyber-cyan/50" />

        {/* HUD Sector Coordinates */}
        <div className="text-[9px] text-cyber-cyan/40 font-mono tracking-wider uppercase writing-mode-vertical text-center select-none font-bold">
          SYS_SEC_COORD
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex flex-col gap-6 w-full items-center my-auto relative">
          {/* Vertical track connector line */}
          <div className="absolute top-6 bottom-6 w-[1px] bg-cyber-cyan/15 left-1/2 transform -translate-x-1/2 z-0" />

          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  // Clear internal card selections on tab switch
                  setSelectedNode(null);
                  setSelectedProject(null);
                }}
                title={item.label}
                className={`relative w-14 h-14 rounded-lg border flex items-center justify-center transition-all duration-300 z-10 cursor-pointer ${
                  isActive
                    ? `bg-slate-900 border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.45)] text-cyber-cyan scale-110`
                    : 'bg-slate-950/50 border-cyber-cyan/20 text-gray-500 hover:text-cyber-cyan hover:border-cyber-cyan/60 hover:bg-slate-900/40 hover:scale-105'
                }`}
              >
                {/* Visual order index */}
                <span className={`absolute -top-1 -left-1 text-[8px] font-mono px-1 rounded leading-none ${isActive ? 'bg-cyber-cyan text-slate-950 font-bold' : 'bg-slate-900 text-cyber-cyan/40'}`}>
                  0{idx + 1}
                </span>
                <Icon className="w-6 h-6" />

                {/* Blinking active dot */}
                {isActive && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyber-pink rounded-full border border-slate-950 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Vertical footer status inside sidebar */}
        <div className="text-[9px] text-cyber-cyan font-bold tracking-widest font-mono rotate-180 uppercase select-none [writing-mode:vertical-lr]">
          COCKPIT_V4.0
        </div>
      </nav>

      {/* 3. DYNAMIC RIGHT CONTROL DECK PANEL (Unified Information Center - Expanded Width) */}
      {activeSection !== 'contact' && (
        <aside className="fixed right-4 top-20 bottom-20 w-[480px] max-w-[95%] z-20 flex flex-col border border-cyber-cyan/20 bg-slate-950/85 backdrop-blur-md rounded select-none pointer-events-auto overflow-hidden shadow-2xl font-mono animate-fadeIn">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyber-cyan/50" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyber-cyan/50" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyber-cyan/50" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyber-cyan/50" />

          {/* Control Panel Tab Title */}
          <div className="bg-slate-950/90 px-5 py-4 border-b border-cyber-cyan/15 flex justify-between items-center text-sm text-cyber-cyan/80 font-bold shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
              <span className="uppercase text-xs tracking-wider">
                MODULE_STREAM: {activeSection === 'home' ? 'OVERVIEW' : activeSection === 'about' ? 'STACK_NODES' : 'REGISTRY'}
              </span>
            </div>
            <span className="text-xs text-cyber-cyan/40">SYS_LVL: 0{navItems.findIndex(n => n.id === activeSection) + 1}</span>
          </div>

          {/* Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar text-sm text-gray-300">
            
            {/* TAB 1: CORE OVERVIEW */}
            {activeSection === 'home' && (
              <div className="space-y-5 font-mono">
                <div className="border border-cyber-cyan/15 p-5 rounded bg-slate-900/30 relative">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyber-cyan/40" />
                  <span className="text-[9px] text-cyber-pink uppercase font-bold tracking-widest block mb-1">Developer Credentials</span>
                  <h1 className="text-white text-2xl font-bold tracking-wide leading-tight text-glow-cyan uppercase">
                    Easwaramurthy P
                  </h1>
                  <p className="text-cyber-cyan text-xs font-bold mt-1 uppercase tracking-wider">
                    Role: Full-Stack Software Engineer
                  </p>
                  <p className="text-gray-400 text-xs uppercase tracking-wider">
                    Location: Chennai, IN
                  </p>
                </div>

                <div className="space-y-3 leading-relaxed text-[13px] text-gray-300">
                  <p>
                    &gt; Welcome to the Quantum Core diagnostic workspace. I am an undergraduate software engineer specializing in scalable systems architectures, WebGL environments, and full-stack software development workflows.
                  </p>
                  <p>
                    &gt; Click through the left cockpit modules to examine technical stack proficiencies, deployed container drives, and secure gateway routes.
                  </p>
                </div>

                {/* Credential metrics details */}
                <div className="bg-slate-950/60 border border-cyber-cyan/10 p-4 rounded flex flex-col gap-3">
                  <div className="text-[10px] text-cyber-cyan/70 font-bold border-b border-cyber-cyan/10 pb-1.5">
                    SYSTEM_STATUS_ TELEMETRY
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>COORDINATES: <span className="text-white font-bold">{getCoordinates()}</span></div>
                    <div>AVAILABILITY: <span className="text-cyber-green font-bold">IMMEDIATE / FT</span></div>
                    <div>DEGREE: <span className="text-white font-bold">Undergrad Engineer</span></div>
                    <div>EXPERIENCE: <span className="text-cyber-pink font-bold">Junior Full-Stack</span></div>
                  </div>
                </div>

                <a
                  href="/Easwar_Resume.pdf"
                  download="Easwar_Resume.pdf"
                  className="w-full flex items-center justify-center gap-2 py-3.5 border border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan text-glow-cyan text-xs font-bold uppercase rounded tracking-widest hover:bg-cyber-cyan/25 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer mt-5"
                >
                  [ DOWNLOAD_RESUME_DATA ]
                </a>
              </div>
            )}

            {/* TAB 2: SYSTEM ARCHITECTURE STACK GRAPH */}
            {activeSection === 'about' && (
              <div className="space-y-5">
                {!selectedNode ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        &gt; Below is the list of technical modules currently indexed in the active stack graph. Click any element to load its full capability specifications.
                      </p>
                    </div>

                    {/* Skills organized list */}
                    {['frontend', 'backend', 'database', 'devops'].map((cat) => {
                      const nodes = techNodes.filter(n => n.category === cat);
                      const titleLabels = {
                        frontend: 'FRONTEND_ENGINE',
                        backend: 'BACKEND_SERVICE',
                        database: 'DATA_CLUSTER',
                        devops: 'INFRASTRUCTURE'
                      };
                      
                      return (
                        <div key={cat} className="space-y-2 border-t border-cyber-cyan/10 pt-4 first:border-0 first:pt-0">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 block">
                            {titleLabels[cat as keyof typeof titleLabels]}
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {nodes.map(node => (
                              <button
                                key={node.id}
                                onClick={() => setSelectedNode(node)}
                                className="text-left px-3.5 py-2.5 border border-cyber-cyan/10 hover:border-cyber-cyan/40 bg-slate-900/40 rounded-md text-xs text-gray-300 hover:text-white flex items-center justify-between group transition-all cursor-pointer font-bold"
                              >
                                <span>{node.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  /* Selected Node Detail View */
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex justify-between items-start border-b border-cyber-cyan/15 pb-2.5">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-cyber-pink">
                          {selectedNode.category}_CORE_SPEC
                        </span>
                        <h2 className="text-white text-xl font-bold tracking-wide uppercase mt-0.5">
                          {selectedNode.name}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="text-gray-400 hover:text-white border border-transparent p-1 rounded hover:border-cyber-cyan/20 bg-slate-900/30 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[13px] text-gray-300 leading-relaxed">
                      {selectedNode.details}
                    </p>

                    <div className="space-y-2.5 border-t border-cyber-cyan/15 pt-4">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500 block">
                        Capabilities Modules:
                      </span>
                      <div className="grid grid-cols-2 gap-2 select-text">
                        {selectedNode.skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2 text-white">
                            <span className="w-1.5 h-1.5 bg-cyber-green rounded-full shrink-0" />
                            <span className="text-xs text-gray-300">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Candidate summary panel */}
                    <div className="bg-slate-900/50 border border-cyber-cyan/10 p-3.5 rounded text-[10px] text-gray-400 space-y-1">
                      <span className="text-[8px] text-cyber-cyan font-bold block uppercase tracking-wider">DIAGNOSTIC SUMMARY</span>
                      <div>PROFILE_MATCH: <span className="text-white">Undergraduate Engineer</span></div>
                      <div>SEEKING_PLACEMENT: <span className="text-cyber-pink font-bold">Enterprise Development Roles</span></div>
                    </div>

                    <button
                      onClick={() => setSelectedNode(null)}
                      className="w-full py-2.5 border border-cyber-cyan/25 hover:border-cyber-cyan text-cyber-cyan hover:text-white rounded text-[10px] uppercase font-bold tracking-wider hover:bg-cyber-cyan/10 transition-all cursor-pointer"
                    >
                      &lt; RETURN_TO_LIST
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROJECTS REGISTRY */}
            {activeSection === 'projects' && (
              <div className="space-y-5">
                {!selectedProject ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        &gt; Deployed server containers drives initialized on the network grid. Select a card below to display performance logs, stack metrics, and live access links.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {projectsData.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className="w-full text-left p-4.5 border border-cyber-cyan/10 hover:border-cyber-cyan/40 bg-slate-900/20 hover:bg-slate-900/50 rounded-lg flex flex-col gap-1.5 transition-all group cursor-pointer relative"
                        >
                          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan/40 opacity-50" />
                          <span className="text-[9px] text-cyber-pink uppercase font-bold tracking-widest">{project.category}</span>
                          <div className="flex items-center justify-between mt-0.5">
                            <h3 className="text-white text-sm font-bold tracking-wide uppercase">{project.name}</h3>
                            <ChevronRight className="w-4 h-4 text-cyber-cyan opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                          </div>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-3">{project.description}</p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Selected Project Detail View */
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex justify-between items-start border-b border-cyber-cyan/15 pb-2.5">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-cyber-pink">
                          {selectedProject.category}
                        </span>
                        <h2 className="text-white text-xl font-bold tracking-wide uppercase mt-0.5">
                          {selectedProject.name}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="text-gray-400 hover:text-white border border-transparent p-1 rounded hover:border-cyber-cyan/20 bg-slate-900/30 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs md:text-[13px] text-gray-300 leading-relaxed">
                      {selectedProject.description}
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-2 border-t border-cyber-cyan/15 pt-4">
                      {selectedProject.tech.map((t, i) => (
                        <span 
                          key={i} 
                          className="bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/25 px-2.5 py-0.5 rounded text-[10px] font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Production container metrics */}
                    <div className="bg-slate-900/40 border border-cyber-cyan/10 p-4 rounded flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[10px] text-cyber-cyan/70 font-bold border-b border-cyber-cyan/10 pb-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-cyber-cyan" />
                        <span>TELEMETRY_METRICS</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        {selectedProject.metrics.map((metric, i) => (
                          <div key={i} className="flex flex-col border-r border-cyber-cyan/10 last:border-none px-1">
                            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">{metric.label}</span>
                            <span className="text-xs text-white font-extrabold text-glow-cyan mt-1">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deployment links */}
                    <div className="flex justify-between items-center pt-2.5 gap-3 shrink-0">
                      <a 
                        href={selectedProject.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-slate-950 border border-cyber-cyan/20 hover:border-cyber-cyan text-gray-300 hover:text-cyber-cyan py-3 rounded-md text-xs uppercase font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>Explore Codebase</span>
                      </a>
                      
                      <a 
                        href={selectedProject.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan hover:text-white py-3 rounded-md text-xs uppercase font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Launch Live App</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSelectedProject(null)}
                      className="w-full py-2.5 border border-cyber-cyan/25 hover:border-cyber-cyan text-cyber-cyan hover:text-white rounded text-[10px] uppercase font-bold tracking-wider hover:bg-cyber-cyan/10 transition-all cursor-pointer mt-1"
                    >
                      &lt; RETURN_TO_REGISTRY
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Diagnostic telemetry details panel at top right sidebar */}
          <div className="bg-slate-950 px-5 py-2.5 border-t border-cyber-cyan/15 flex justify-between items-center text-[9px] text-cyber-cyan/40 uppercase shrink-0 font-bold">
            <span>PACKET_SYS: ENABLED</span>
            <span>COORDINATES: {getCoordinates()}</span>
          </div>
        </aside>
      )}

      {/* 4. CENTERED API GATEWAY PANEL (Rendered ONLY in Contact/API Gateway tab - Spacious Terminal Form) */}
      {activeSection === 'contact' && (
        <div className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[550px] z-20 pointer-events-auto font-mono animate-fadeIn">
          <div className="glass-panel border border-cyber-green/30 rounded-lg shadow-2xl overflow-hidden text-glow-green">
            
            {/* Terminal Header Bar */}
            <div className="bg-slate-950 px-5 py-3.5 border-b border-cyber-green/20 flex justify-between items-center text-xs text-cyber-green/70 font-bold">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-green animate-pulse" />
                <span className="tracking-wider uppercase">GATEWAY_PROMPT://api.contact</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-cyber-green/60 animate-pulse" />
              </div>
            </div>

            {/* Terminal Screen area */}
            <div className="p-6 md:p-8 bg-slate-950/80 flex flex-col gap-5 text-xs text-cyber-green">
              
              {/* Diagnostic Standby Log */}
              {!successResponse && !errorMsg && (
                <div className="text-[11px] text-cyber-green/60 leading-relaxed border-b border-cyber-green/10 pb-3 font-mono">
                  === SECURE ROUTING GATEWAY ESTABLISHED ===<br/>
                  &gt; STATUS: STANDBY // PORT: 443<br/>
                  &gt; ENTER REQUIRED IDENTITY PAYLOAD CHUNKS BELOW.
                </div>
              )}

              {/* Error Console alert */}
              {errorMsg && (
                <div className="bg-red-950/40 border border-red-500/30 p-3.5 rounded-md text-[11px] text-red-400 flex items-start gap-2.5 animate-fadeIn font-mono">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold uppercase">SYSTEM_ERROR_CODE:</span> {errorMsg}
                  </div>
                </div>
              )}

              {/* Success payload commitment */}
              {successResponse && (
                <div className="bg-green-950/40 border border-cyber-green/40 p-5 rounded-md text-xs text-cyber-green/90 flex flex-col gap-2.5 animate-fadeIn font-mono">
                  <div className="flex items-center gap-2 font-bold text-white uppercase text-xs">
                    <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                    <span>PAYLOAD TRANSMITTED SUCCESSFULLY</span>
                  </div>
                  <div className="grid grid-cols-3 gap-y-1.5 text-xs text-cyber-green/70 border-t border-cyber-green/10 pt-3 mt-1.5">
                    <span>PACKET ID:</span>
                    <span className="col-span-2 text-white font-bold">{successResponse.packetId}</span>
                    
                    <span>TIMESTAMP:</span>
                    <span className="col-span-2 text-white">{new Date(successResponse.timestamp).toLocaleString()}</span>
                    
                    <span>STATUS:</span>
                    <span className="col-span-2 text-cyber-green">SECURELY_STORED</span>
                  </div>
                  <p className="mt-2 text-xs italic text-cyber-green/80 border-t border-cyber-green/10 pt-2 leading-relaxed">
                    &gt; {successResponse.message}
                  </p>
                </div>
              )}

              {/* Centered Contact form fields */}
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-cyber-green/60 font-bold">
                    Identity Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading || isTransmitting}
                    placeholder="Developer / Recruiter"
                    className="bg-slate-900 border border-cyber-green/20 focus:border-cyber-green text-white text-xs px-4 py-3 rounded-md outline-none placeholder:text-cyber-green/30 focus:shadow-[0_0_10px_rgba(0,255,102,0.15)] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-cyber-green/60 font-bold">
                    Email Destination:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || isTransmitting}
                    placeholder="recruiter@company.com"
                    className="bg-slate-900 border border-cyber-green/20 focus:border-cyber-green text-white text-xs px-4 py-3 rounded-md outline-none placeholder:text-cyber-green/30 focus:shadow-[0_0_10px_rgba(0,255,102,0.15)] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-cyber-green/60 font-bold">
                    Message Payload:
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading || isTransmitting}
                    placeholder="System collaboration proposal..."
                    rows={4}
                    className="bg-slate-900 border border-cyber-green/20 focus:border-cyber-green text-white text-xs px-4 py-3 rounded-md outline-none resize-none placeholder:text-cyber-green/30 focus:shadow-[0_0_10px_rgba(0,255,102,0.15)] transition-all"
                  />
                </div>

                {/* Relaying triggers button */}
                <button
                  type="submit"
                  disabled={loading || isTransmitting}
                  className="mt-3 bg-cyber-green/10 hover:bg-cyber-green/20 border border-cyber-green hover:shadow-[0_0_15px_rgba(0,255,102,0.35)] transition-all duration-300 py-3 rounded-md font-bold uppercase tracking-widest text-[10px] text-cyber-green flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  {loading ? (
                    <span>RELAYING DATA PACKET...</span>
                  ) : isTransmitting ? (
                    <span>TRANSMITTING ON FLY PATH...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 animate-pulse" />
                      <span>LAUNCH_TRANSMISSION.SH</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 5. BOTTOM SYSTEM TELEMETRY & CLOCK BAR */}
      <footer className="fixed bottom-4 left-4 right-4 z-20 pointer-events-none font-mono">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 bg-slate-950/80 border border-cyber-cyan/20 px-5 py-3 rounded backdrop-blur-md pointer-events-auto shadow-2xl relative select-none">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan/50" />

          {/* Recruiter profile diagnostic tracker */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-cyber-cyan font-bold tracking-wider shrink-0 uppercase">
              EXHAUST_TRACKER // PROFILE_ANALYSIS:
            </span>
            <div className="h-2.5 bg-slate-900 border border-cyber-cyan/35 rounded-sm flex-1 md:w-40 overflow-hidden max-w-[220px]">
              <div 
                className="h-full bg-cyber-cyan transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                style={{ width: `${scanPercentage}%` }}
              />
            </div>
            <span className="text-xs text-white font-extrabold text-glow-cyan shrink-0">
              {scanPercentage}%
            </span>
          </div>

          {/* Centered hardware log ticker */}
          <div className="hidden lg:flex items-center gap-4 text-[10px] text-cyber-cyan/60 grow justify-center border-l border-r border-cyber-cyan/15 mx-6 px-6 truncate select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-pink animate-pulse" />
            <span className="truncate font-mono">
              {activeSection === 'home' && '> SYSTEM_LOG: INITIALIZING_3D_CORE_RENDERER // ALLOCATING_BUFFERS_OK'}
              {activeSection === 'about' && '> SYSTEM_LOG: GRAPH_CONSTELLATION_ASSEMBLED // 16_NODE_VECTORS_ON_LINE'}
              {activeSection === 'projects' && '> SYSTEM_LOG: SHIELDING_CONTAINER_METRICS // 3_POD_DOCKS_LISTENING'}
              {activeSection === 'contact' && '> SYSTEM_LOG: SECURE_API_ROUTING_ONLINE // WAITING_FOR_PAYLOAD_RELAY'}
            </span>
            <span className="text-gray-700 font-normal">|</span>
            <span className="text-[9px] uppercase tracking-wider text-cyber-pink font-bold shrink-0">
              CORE_TEMP: {systemTemp}°C
            </span>
          </div>

          {/* Social media direct link deck */}
          <div className="flex items-center gap-5 border-t border-cyber-cyan/15 pt-2.5 md:pt-0 md:border-t-0 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-3 pr-4 border-r border-cyber-cyan/15">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Github"
                className="w-8 h-8 rounded-md border border-cyber-cyan/20 hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all duration-300 cursor-pointer"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-8 h-8 rounded-md border border-cyber-cyan/20 hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all duration-300 cursor-pointer"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a 
                href="mailto:contact@easwar.dev" 
                title="Mail Connection"
                className="w-8 h-8 rounded-md border border-cyber-cyan/20 hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all duration-300 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-[9px] text-cyber-cyan/50 font-bold uppercase shrink-0">
              <span>SCAN_PORT_STATUS: LISTENING</span>
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
