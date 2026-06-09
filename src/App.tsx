/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, X, Laptop, Terminal, ExternalLink, Cloud, 
  Database, Info, Compass, HelpCircle, Copy, Check 
} from "lucide-react";
import { Project, AppStatus } from "./types";

// Import sections
import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (err) {
      console.error("Failed to connect to backend /api/status:", err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects database records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchProjects();

    // Intersection observer to track active section highlights
    const sections = ["home", "about", "skills", "projects", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const codeSample = `MONGO_URI="mongodb+srv://<username>:<password>@cluster0.abc.mongodb.net/portfolioDB?retryWrites=true&w=majority"
PORT=3000
NODE_ENV=production`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSample);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans leading-relaxed selection:bg-blue-500/30 selection:text-white">
      
      {/* Dynamic Background Noise Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none z-0" />

      {/* Primary Header/Navbar */}
      <header className="fixed top-0 left-0 w-full bg-[#090d16]/80 backdrop-blur-md border-b border-slate-900 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
          
          {/* Logo Brandmark */}
          <button 
            id="navbar-logo"
            onClick={() => handleNavigate("home")} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="h-9 w-9 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center font-mono text-sm text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
              AC
            </div>
            <span className="font-bold text-lg text-white font-sans tracking-tight">alexchen<span className="text-blue-500">.dev</span></span>
          </button>

          {/* Desktop Nav Actions */}
          <nav className="hidden md:flex items-center gap-1.5Packed">
            {["home", "about", "skills", "projects", "contact"].map((section) => (
              <button
                key={section}
                id={`nav-link-${section}`}
                onClick={() => handleNavigate(section)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize tracking-wide transition duration-200 cursor-pointer ${
                  activeSection === section 
                    ? "text-blue-400 bg-blue-500/5 border-b-2 border-blue-500/40" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                {section}
              </button>
            ))}
          </nav>

          {/* Secondary CTA options (Deploy guide popup) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              id="show-deploy-guide-btn"
              onClick={() => setShowDeployGuide(true)}
              className="px-4 py-1.5 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/15 text-xs font-mono font-medium rounded-lg text-blue-400 cursor-pointer transition flex items-center gap-1.5"
            >
              <Cloud className="w-3.5 h-3.5" />
              Deploy Stack
            </button>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              id="mobile-deploy-info-btn"
              onClick={() => setShowDeployGuide(true)}
              className="p-2 border border-blue-500/10 text-blue-450 bg-blue-500/5 rounded-lg text-blue-400"
              title="Deployment guide"
            >
              <Cloud className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border border-slate-800 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-white transition text-slate-400 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 w-full bg-[#090d16] border-b border-slate-900 z-40 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 space-y-3 flex flex-col">
              {["home", "about", "skills", "projects", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => handleNavigate(section)}
                  className={`py-2 text-left text-base font-medium capitalize border-b border-slate-900 ${
                    activeSection === section ? "text-blue-400 font-semibold" : "text-slate-400"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Body Grid */}
      <main className="flex-1 relative z-10">
        {/* Sections */}
        <Home onNavigate={handleNavigate} projectCount={projects.length} />
        <About />
        <Skills />
        <Projects projects={projects} status={status} onRefresh={fetchProjects} />
        <Contact />
      </main>

      {/* Footer Branding Area */}
      <footer className="bg-[#060910] border-t border-slate-900 py-16 text-slate-500 text-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-blue-600/10 border border-blue-500/15 rounded text-blue-400 font-mono text-xs flex items-center justify-center">
                AC
              </div>
              <span className="font-bold text-white text-base">Alex Chen</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm">
              An elegant, fully responsive portfolio showcase powered by dynamic Node APIs, React framework structures, and real MongoDB persistence handlers.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#5c6e8e]">Quick Access</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-medium">
              <button onClick={() => handleNavigate("home")} className="text-left hover:text-white transition">/home</button>
              <button onClick={() => handleNavigate("about")} className="text-left hover:text-white transition">/about</button>
              <button onClick={() => handleNavigate("skills")} className="text-left hover:text-white transition">/skills</button>
              <button onClick={() => handleNavigate("projects")} className="text-left hover:text-white transition">/projects</button>
              <button onClick={() => handleNavigate("contact")} className="text-left hover:text-white transition">/contact</button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#5c6e8e]">Current Engine State</h4>
            <div className="text-xs bg-slate-950 border border-slate-900 rounded p-3 font-mono text-slate-450 space-y-1 text-slate-400">
              <div className="text-[10px] text-slate-600">DB: {status?.database || "Offline"}</div>
              <div className="text-[10px] text-slate-600">CONNECTED: {status?.connected ? "True" : "False"}</div>
              <div className="text-blue-400 hover:underline cursor-pointer" onClick={() => setShowDeployGuide(true)}>
                Deploy instructions
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-12 mt-12 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} Alex Chen. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
            <span>&bull;</span>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </footer>

      {/* Deployment Explainer Dialog Modal */}
      <AnimatePresence>
        {showDeployGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d1527] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-blue-950/20">
                <div className="flex items-center gap-3 text-blue-400">
                  <Cloud className="w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Full-Stack Deployment Guide</h3>
                    <p className="text-[10px] text-slate-400 font-mono">STEP-BY-STEP VERCEL & RENDER SCHEDULING</p>
                  </div>
                </div>
                <button
                  id="close-deploy-guide"
                  onClick={() => setShowDeployGuide(false)}
                  className="p-2 border border-slate-800 text-slate-450 hover:text-white rounded-lg bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contents Area */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
                
                {/* Intro */}
                <p className="leading-relaxed">
                  This portfolio contains a custom full-stack architecture where the Vite/React UI feeds data directly into the Express.js endpoints. Here is how you can host the application on premium cloud environments like <strong>Render</strong> or <strong>Vercel</strong> while connecting a durable MongoDB Atlas instance.
                </p>

                {/* Section 1: MongoDB Atlas */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2 font-mono text-xs text-blue-400">
                    <span className="p-1 px-2 rounded bg-blue-500/10 text-blue-400 font-mono">01</span>
                    SET UP MONGODB ATLAS
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400 ml-4">
                    <li>Create an account at <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">MongoDB Atlas</a> and spawn a free Shared Cluster.</li>
                    <li>Inside Database Access, create a database user with username, password, and read/write privileges.</li>
                    <li>Inside Network Access, whitelist your target server IP address (or choose <code className="bg-slate-950 px-1 py-0.5 rounded text-slate-300">0.0.0.0/0</code> for cloud platform accessibility).</li>
                    <li>Retrieve the connection string (under Connect &gt; Drivers) which has the form: <code className="bg-slate-950 text-amber-500 p-1 rounded font-mono break-all inline-block mt-1">mongodb+srv://...</code></li>
                  </ul>
                </div>

                {/* Section 2: Environment Config */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-850">
                    <span className="text-xs font-mono text-slate-400">Suggested .env format</span>
                    <button
                      onClick={copyToClipboard}
                      className="p-1 px-2 text-[10px] font-mono border border-slate-700 hover:border-slate-500 rounded bg-slate-900 text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? "Copied" : "Copy Template"}
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded border border-slate-900 font-mono text-xs overflow-x-auto text-emerald-400">
                    {codeSample}
                  </pre>
                </div>

                {/* Section 3: Hosting on Render (Recommended for full Node.js servers) */}
                <div className="space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2 font-mono text-xs text-blue-400">
                    <span className="p-1 px-2 rounded bg-blue-500/10 text-blue-400 font-mono">02</span>
                    HOSTING ON RENDER (BEST FOR EXPRESS)
                  </h4>
                  <p className="text-slate-450 text-slate-400 leading-relaxed pl-5">
                    Render provides instant containerized support for long-running Node/Express backends.
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-400 ml-4">
                    <li>Create an account on <a href="https://render.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Render</a>, trigger **New &gt; Web Service** and link your GitHub Repo.</li>
                    <li>Configure the build properties:
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-[#a5b4fc]">
                        <li>Runtime Environment: <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">Node</code></li>
                        <li>Build Command: <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">npm run build</code></li>
                        <li>Start Command: <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">npm run start</code></li>
                      </ul>
                    </li>
                    <li>Tap on **Environment Settings (Environment Variables)** and insert your credentials:
                      <ul className="list-disc pl-5 mt-1">
                        <li><code className="text-slate-300 font-mono">MONGO_URI</code> &rarr; your real Atlas cluster URI</li>
                        <li><code className="text-slate-300 font-mono">NODE_ENV</code> &rarr; <code className="font-mono text-white">production</code></li>
                      </ul>
                    </li>
                    <li>Trigger deploy! Render will build the React static pages and fire up your full Express engine on Port 3000 mapping.</li>
                  </ol>
                </div>

                {/* Section 4: Web hosting with Serverless functions (Vercel alternative) */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white flex items-center gap-2 font-mono text-xs text-blue-400">
                    <span className="p-1 px-2 rounded bg-blue-500/10 text-blue-400 font-mono">03</span>
                    HOSTING ON VERCEL (SERVERLESS HANDLERS)
                  </h4>
                  <p className="text-slate-400 pl-5">
                    To deploy to Vercel, the express back-end is converted into serverless middleware handlers under a <code className="bg-[#111827] px-1 py-0.5 rounded text-white font-mono">vercel.json</code> schema:
                  </p>
                  <pre className="p-3 bg-slate-950 rounded border border-slate-900 font-mono text-xs text-indigo-400 overflow-x-auto">
{`{
  "version": 2,
  "builds": [
    { "src": "dist/server.cjs", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/projects(.*)", "dest": "dist/server.cjs" },
    { "src": "/contact(.*)", "dest": "dist/server.cjs" },
    { "src": "/api/(.*)", "dest": "dist/server.cjs" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}`}
                  </pre>
                  <p className="text-slate-400 text-xs pl-5 sm:pl-6 leading-relaxed">
                    Set up these environment key-values in your Vercel project's settings dashboard before launching. Mongoose connection logic automatically fires on serverless invocations.
                  </p>
                </div>

              </div>

              {/* Action area */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
                <button
                  id="close-deploy-guide-footer"
                  onClick={() => setShowDeployGuide(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs transition uppercase cursor-pointer"
                >
                  I Understand
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
