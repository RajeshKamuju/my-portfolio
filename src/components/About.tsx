/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Award, Briefcase, GraduationCap, Code } from "lucide-react";

export default function About() {
  const experiences = [
    {
      role: "Senior Full-Stack Architect",
      company: "InnovateTech Solutions",
      period: "2024 - Present",
      description: "Spearheaded the redesign of enterprise cloud orchestration systems, connecting Node backends with distributed MongoDB clusters to reduce API query times by 40%.",
      icon: Briefcase,
    },
    {
      role: "Full-Stack Software Engineer",
      company: "CloudBound Labs",
      period: "2022 - 2024",
      description: "Implemented high-throughput Express.js REST APIs and real-time analytical dashboards using React and Tailwind CSS. Managed large-scale MongoDB database migrations.",
      icon: Code,
    },
    {
      role: "Bachelor of Science in Computer Science",
      company: "Stanford University",
      period: "2018 - 2022",
      description: "Specialized in Software Engineering, database normalization algorithms, and cloud systems security paradigms.",
      icon: GraduationCap,
    },
  ];

  const highlights = [
    { title: "Clean Code", value: "SOLID, DRY, and well-commented" },
    { title: "Performant APIs", value: "Optimized queries & caching" },
    { title: "User First", value: "Aesthetic layouts and micro-interactions" },
    { title: "Highly Scalable", value: "Modular folder architectures" },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            About Me
          </motion.h2>
          <div className="h-1 w-16 bg-blue-500 mx-auto rounded-full mb-4" />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            I resolve complex product challenges by writing clean, highly semantic, and secure full-stack code.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Bio & Highlight Grid (Left Columns) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-semibold text-white">Who I Am & What I Do</h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                With a passion for building robust digital systems, I specialize in combining modern, ultra-responsive frontend architectures with high-performance Node.js servers and structured MongoDB collections.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                I believe that good programming is about both technical viability and seamless user delight. My systems are fully responsive, accessible, secure, and ready to meet exact client specifications.
              </p>

              {/* Dynamic highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                {highlights.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">{item.title}</div>
                    <div className="text-sm font-semibold text-blue-400">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Achievement Card */}
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-950/40 border border-blue-800/30 rounded-2xl p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Pragmatic Architect</div>
                <div className="text-xs text-slate-400">Delivering production-grade deployments with speed and maintainable structures.</div>
              </div>
            </div>
          </div>

          {/* Professional Experience Timeline (Right Columns) */}
          <div className="lg:col-span-6 space-y-8">
            <h3 className="text-xl font-semibold text-white pl-2">Professional Journey</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-[2px] before:bg-slate-800/80">
              {experiences.map((exp, idx) => {
                const Icon = exp.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex gap-6 relative group"
                  >
                    {/* Circle Node with Icon */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 group-hover:text-blue-300 group-hover:border-slate-700 transition shadow-lg">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Timeline card contents */}
                    <div className="flex-1 bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 hover:border-slate-750 transition duration-300">
                      <div className="flex flex-wrap items-center justify-between gap-y-1 mb-2">
                        <h4 className="font-semibold text-white text-base sm:text-lg">{exp.role}</h4>
                        <span className="text-xs font-mono font-medium text-slate-500 bg-slate-950/50 px-2.5 py-1 rounded border border-slate-800">{exp.period}</span>
                      </div>
                      <div className="text-xs text-blue-400 font-medium mb-3">{exp.company}</div>
                      <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
