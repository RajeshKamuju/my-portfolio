/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Edit, Trash2, ExternalLink, Github, Database, 
  Settings, Check, X, Code, RefreshCw, AlertTriangle
} from "lucide-react";
import { Project, AppStatus } from "../types";

interface ProjectsProps {
  projects: Project[];
  status: AppStatus | null;
  onRefresh: () => void;
}

export default function Projects({ projects, status, onRefresh }: ProjectsProps) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Editor Form States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Form Inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [image, setImage] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSkillsStr("");
    setImage("");
    setGithub("");
    setDemo("");
    setEditingProject(null);
    setIsAddingNew(false);
    setErrorMessage("");
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsAddingNew(false);
    
    // Seed fields
    setTitle(project.title);
    setDescription(project.description);
    setSkillsStr(project.skills.join(", "));
    setImage(project.image);
    setGithub(project.github || "");
    setDemo(project.demo || "");
    setErrorMessage("");
    
    // Scroll to form
    const element = document.getElementById("admin-form-anchor");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddNewClick = () => {
    resetForm();
    setIsAddingNew(true);
    setErrorMessage("");
    
    // Scroll to form
    const element = document.getElementById("admin-form-anchor");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // REST API: POST /projects or PUT /projects/:id
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Title and description are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      title,
      description,
      skills: skillsStr.split(",").map(s => s.trim()).filter(Boolean),
      image: image.trim() || undefined,
      github: github.trim(),
      demo: demo.trim(),
    };

    try {
      const isEdit = !!editingProject;
      const url = isEdit ? `/projects/${editingProject._id}` : "/projects";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save project.");
      }

      setSuccessMessage(
        isEdit 
          ? `Successfully updated project "${title}"!` 
          : `Successfully added project "${title}"!`
      );
      
      resetForm();
      onRefresh(); // Refresh parent lists
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // REST API: DELETE /projects/:id
  const handleDeleteClick = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the project "${name}"?`)) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete project.");
      }

      setSuccessMessage(`Successfully removed project "${name}".`);
      onRefresh();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred.");
    }
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-900/45 border-y border-slate-800/60">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
  My Projects
</h2>
            <div className="h-1 w-16 bg-blue-500 rounded-full mb-4 mx-auto md:mx-0" />
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              The following projects showcase my learning journey and practical experience in software development.
            </p>
          </div>

          {/* Controls Panel */}
          <div className="flex flex-wrap gap-3">
            <button
              id="refresh-projects-btn"
              onClick={onRefresh}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-xs font-mono font-medium border border-slate-700 shadow cursor-pointer"
              title="Refresh database records"
            >
              <RefreshCw className="w-4 h-4" />
              Sync DB
            </button>
            <button
              id="toggle-admin-btn"
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                resetForm();
              }}
              className={`p-3 rounded-xl transition flex items-center gap-2 text-xs font-mono font-medium border cursor-pointer shadow ${
                isAdminMode 
                  ? "bg-amber-600/20 text-amber-300 border-amber-500/50 hover:bg-amber-600/30" 
                  : "bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20"
              }`}
            >
              <Settings className="w-4 h-4" />
              {isAdminMode ? "Exit Editor Mode" : "Portfolio Editor Mode"}
            </button>
          </div>
        </div>

        {/* Database Connectivity Badge */}
        {status && (
          <div className="mb-8 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Database className={`w-4 h-4 ${status.connected ? "text-emerald-400" : "text-amber-400 animate-pulse"}`} />
              <span className="text-xs font-mono text-slate-400">
                Database Provider: <span className="text-slate-200 font-semibold">{status.database}</span>
              </span>
            </div>
            {!status.connected && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                Database Connection Unavailable
              </div>
            )}
            {status.connected && (
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                MongoDB Atlas Connected
              </div>
            )}
          </div>
        )}

        {/* Status Notifications */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center justify-between"
            >
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="text-emerald-400 hover:brightness-125"><X className="w-4 h-4" /></button>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-505/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between"
            >
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage("")} className="text-red-400 hover:brightness-125"><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Anchor point for editor form */}
        <div id="admin-form-anchor" />

        {/* Interactive Editor Form (POST or PUT) */}
        {isAdminMode && (isAddingNew || editingProject) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-slate-900 border border-slate-700/60 rounded-2xl p-6 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="text-blue-400 w-5 h-5" />
                {editingProject ? `Edit Project: "${editingProject.title}"` : "Add New Dynamic Project"}
              </h3>
              <button
                id="cancel-form-btn"
                onClick={resetForm}
                className="p-1 px-2 text-slate-400 hover:text-white rounded bg-slate-950/40 text-xs border border-slate-800 transition"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AI Chatbot"
                    className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-755 focus:border-blue-500 rounded-lg p-3 text-sm focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the application features, background backend stack, or core mechanics..."
                    className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-755 focus:border-blue-500 rounded-lg p-3 text-sm resize-none focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Technologies / Skills (Comma Separated) *</label>
                  <input
                    type="text"
                    required
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    placeholder="React, Express, MongoDB, Tailwind"
                    className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-755 focus:border-blue-500 rounded-lg p-3 text-sm focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/your-image"
                    className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-755 focus:border-blue-500 rounded-lg p-3 text-sm focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/developer/project"
                    className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-755 focus:border-blue-500 rounded-lg p-3 text-sm focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Live Demo URL</label>
                  <input
                    type="text"
                    value={demo}
                    onChange={(e) => setDemo(e.target.value)}
                    placeholder="https://project-demo.live"
                    className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-755 focus:border-blue-500 rounded-lg p-3 text-sm focus:outline-none transition"
                  />
                </div>

                <div className="pt-2 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? "Saving record..." : editingProject ? "Save Changes" : "Save Project"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Trigger to initiate dynamic creation */}
        {isAdminMode && !isAddingNew && !editingProject && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleAddNewClick}
            className="mb-8 w-full p-6 border-2 border-dashed border-slate-800 hover:border-slate-600 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-900/20 text-slate-400 hover:text-white transition group py-10 cursor-pointer"
          >
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-full group-hover:scale-105 transition duration-300">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <div className="font-semibold text-sm">Add New Project</div>
            <div className="text-xs text-slate-500 font-mono">Triggers backend: POST /projects</div>
          </motion.button>
        )}

        {/* Dynamic Project Grid list */}
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
            <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No projects found in collection.</p>
            <p className="text-slate-500 text-xs mt-1">Check database connection or click "Sync DB" to refresh.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/70 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition duration-300 flex flex-col group relative"
              >
                
                {/* Image panel with badge */}
                <div className="h-48 overflow-hidden relative bg-slate-950">
                  <img
                    referrerPolicy="no-referrer"
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-95 group-hover:brightness-100"
                    onError={(e) => {
                      // fallback nicely
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  
                  {/* Floating Action Buttons for Admin Mod */}
                  {isAdminMode && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 bg-slate-950/90 text-amber-400 hover:bg-slate-900 rounded-lg hover:scale-105 border border-slate-800 transition shadow cursor-pointer"
                        title="Edit Project Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item._id, item.title)}
                        className="p-2 bg-slate-950/90 text-red-400 hover:bg-slate-900 rounded-lg hover:scale-105 border border-slate-800 transition shadow cursor-pointer"
                        title="Delete Project Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Backend origin badge */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 text-[9px] font-mono text-slate-300 bg-slate-950/80 rounded border border-slate-800">
                    ID: {item._id.substring(0, 10)}...
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-blue-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Skills tags and action triggers */}
                  <div className="space-y-4 pt-3 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5Packed">
                      {item.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="text-[10px] font-mono font-medium tracking-wide text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 mb-1 inline-block mr-1">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      
                      {/* GitHub Link */}
                      {item.github ? (
                        <a
                          href={item.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 hover:text-white transition font-medium"
                        >
                          <Github className="w-4 h-4" />
                          Repository
                        </a>
                      ) : (
                        <span className="text-slate-600 flex items-center gap-1"><Github className="w-4 h-4" /> None</span>
                      )}

                      {/* Demo Link */}
                      {item.demo ? (
                        <a
                          href={item.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-450 hover:text-blue-400 transition font-medium text-blue-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Preview
                        </a>
                      ) : (
                        <span className="text-slate-650 flex items-center gap-1 text-slate-600"><ExternalLink className="w-4 h-4" /> None</span>
                      )}

                    </div>
                  </div>

                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
