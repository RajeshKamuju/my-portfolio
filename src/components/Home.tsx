/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail, Cpu, Globe, Database } from "lucide-react";

interface HomeProps {
  onNavigate: (section: string) => void;
  projectCount: number;
}

export default function Home({ onNavigate, projectCount }: HomeProps) {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative pt-16 overflow-hidden">
      {/* Background soft ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
        
        {/* Left column: Text contents */}
        <div className="lg:col-span-7 space-y-8 flex flex-col justify-center text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs text-blue-400 font-mono w-fit mx-auto lg:mx-0 shadow-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Open to Internships and Entry-Level Opportunities
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Hi, I'm <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent hover:brightness-110 transition duration-300">Rajesh Kamuju</span>
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-medium text-slate-300"
            >
              Java Full Stack Developer | B.Tech CSE Student
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-400 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
             Passionate Computer Science student with an interest in Java, Full Stack Development, and Artificial Intelligence. I enjoy building practical applications and continuously improving my problem-solving skills through projects and hands-on learning.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2"
          >
            <button
              id="home-cta-projects"
              onClick={() => onNavigate("projects")}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer"
            >
              Explore My Projects
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="home-cta-contact"
              onClick={() => onNavigate("contact")}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg font-medium transition cursor-pointer"
            >
              Let's Connect
            </button>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-4 justify-center lg:justify-start pt-4 text-slate-400"
          >
            <a
              id="social-github"
              href="https://github.com/RajeshKamuju"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              id="social-linkedin"
              href="https://www.linkedin.com/in/rajesh-kamuju-b8800738a/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              id="social-mail"
              href="mailto:rkamuju39@gmail.com"
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 transition"
            >
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        {/* Right column: Interactive Visual Hero Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
            {/* Visual Glassmorphism Board resembling server activity */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl filter blur-3xl opacity-20 animate-pulse" />
            
            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
              {/* Fake Terminal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-[10px] font-mono text-slate-500">status.config</div>
              </div>

              {/* Server Stats Terminal Code Block */}
              <div className="font-mono text-xs text-slate-300 space-y-3">
                <p className="text-slate-500">{"// Active Full-Stack Architecture"}</p>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>runtime: <span className="text-emerald-400">Node v20.x</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>server: <span className="text-blue-400">Express (Port 3000)</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-violet-400" />
                  <span>database: <span className="text-violet-400">Mongoose / Atlas</span></span>
                </div>
              </div>

              {/* Dynamic Interactive Metrics Board inside Hero */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-xs text-slate-500">Api Status</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">200 OK</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-xs text-slate-500">Total Projects</div>
                  <div className="text-sm font-bold text-blue-400 font-mono">{projectCount} Active</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-xs text-slate-500">Uptime</div>
                  <div className="text-sm font-bold text-indigo-400 font-mono">99.98%</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-xs text-slate-500">Framework</div>
                  <div className="text-sm font-bold text-pink-400 font-mono">React 19</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
