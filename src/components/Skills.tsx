/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Check, Terminal, ExternalLink, Code2, Layers, Server, ShieldCheck } from "lucide-react";

export default function Skills() {
  const skillSections = [
    {
      title: "Frontend Development",
      icon: Code2,
      color: "from-blue-500/20 to-cyan-500/10",
      skills: [
        { name: "React 19 & Next.js", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Tailwind CSS", level: 95 },
        { name: "Redux Toolkit & Context", level: 85 },
        { name: "HTML5 & Canvas", level: 85 },
        { name: "D3.js / Recharts", level: 80 }
      ]
    },
    {
      title: "Backend Development",
      icon: Server,
      color: "from-indigo-500/20 to-violet-500/10",
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Express.js", level: 92 },
        { name: "REST APIs Architecture", level: 95 },
        { name: "GraphQL", level: 75 },
        { name: "Aynchronous Event Loops", level: 85 }
      ]
    },
    {
      title: "Database Engineering",
      icon: Layers,
      color: "from-emerald-500/20 to-teal-500/10",
      skills: [
        { name: "MongoDB & Mongoose", level: 92 },
        { name: "PostgreSQL & SQL", level: 85 },
        { name: "Redis Caching", level: 78 },
        { name: "ORM (Sequelize, Drizzle)", level: 80 },
        { name: "Aggregation Frameworks", level: 84 }
      ]
    },
    {
      title: "Cloud & Devops",
      icon: ShieldCheck,
      color: "from-pink-500/20 to-purple-500/10",
      skills: [
        { name: "Docker Containers", level: 80 },
        { name: "Firebase (Auth / Store)", level: 88 },
        { name: "Vercel / Render / GCP", level: 90 },
        { name: "GitHub Actions CI/CD", level: 82 },
        { name: "API Security & Cors", level: 90 }
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Visual ornaments */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            My Tech Stacks
          </motion.h2>
          <div className="h-1 w-16 bg-blue-500 mx-auto rounded-full mb-4" />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            A comprehensive breakdown of my languages, tools, frameworks, and architecture specialties.
          </motion.p>
        </div>

        {/* Bento Grid layout of Stacks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-slate-900/60 border border-slate-800/85 hover:border-slate-700/80 rounded-2xl p-6 sm:p-8 transition duration-300 shadow-xl relative`}
              >
                {/* Visual glow element on components */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} rounded-tr-2xl filter blur-3xl opacity-30 pointer-events-none`} />

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{section.title}</h3>
                </div>

                <div className="space-y-4 relative z-10">
                  {section.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} className="space-y-1.5Packed">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-400" />
                          {skill.name}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{skill.level}%</span>
                      </div>
                      
                      {/* Performance Bar */}
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: skillIdx * 0.05 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Fun engineering standards reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-slate-950/60 border border-slate-850 rounded-xl p-5 flex flex-wrap justify-between items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <Terminal className="text-blue-400 w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              $ cat requirements.json | grep -A2 "philosophies" <span className="text-slate-600">--&gt; {"[\"Clean Code\", \"Always-Up REST\", \"Type Safety\"]"}</span>
            </span>
          </div>
          <div className="text-[10px] font-mono font-medium text-slate-500 bg-slate-900 border border-slate-800 rounded px-2.5 py-1">
            Build Mode: Production-Target
          </div>
        </motion.div>

      </div>
    </section>
  );
}
