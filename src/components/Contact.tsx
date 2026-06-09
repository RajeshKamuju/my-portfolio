/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, User, Send, Check, AlertCircle, RefreshCw, MessagesSquare, X, ShieldAlert } from "lucide-react";
import { ContactMessage } from "../types";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<{ success: boolean; message: string } | null>(null);
  
  // Real-time Submitted Messages Audit Board
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [showInbox, setShowInbox] = useState(false);
  const [loadingInbox, setLoadingInbox] = useState(false);

  const fetchSubmittedMessages = async () => {
    setLoadingInbox(true);
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch messages inbox:", err);
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    if (showInbox) {
      fetchSubmittedMessages();
    }
  }, [showInbox]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setApiResponse({ success: false, message: "Please fill in all details thoroughly." });
      return;
    }

    setIsSubmitting(true);
    setApiResponse(null);

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setApiResponse({
          success: true,
          message: data.message || "Message submitted successfully!",
        });
        // Clear inputs on success
        setName("");
        setEmail("");
        setMessage("");
        
        // Auto-refresh inbox audit if open
        if (showInbox) {
          fetchSubmittedMessages();
        }
      } else {
        setApiResponse({
          success: false,
          message: data.error || "Failed to deliver contact request.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setApiResponse({
        success: false,
        message: "Network request failed. Ensure your server is running on port 3000.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-900/10">
      <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Get In Touch
          </motion.h2>
          <div className="h-1 w-16 bg-blue-500 mx-auto rounded-full mb-4" />
          <p className="text-slate-400 text-sm">
            Feel free to reach out if you would like to connect, discuss projects, or explore collaboration opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Side Area (Columns 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6">
              <h3 className="text-xl font-bold text-white">Contact Information</h3>
             <p className="text-slate-400 text-sm leading-relaxed">
  The contact form is integrated with a Node.js backend and MongoDB database to store submitted messages dynamically.
</p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">DIRECT INQUIRIES</div>
                    <div className="text-sm font-semibold text-white">rkamuju39@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-300">
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-blue-400">
                    <MessagesSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">GITHUB</div>
                    <div className="text-sm font-semibold text-white">https://github.com/RajeshKamuju</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inbox Toggle button to dynamically verify entries in the frontend */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="font-mono text-xs text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Message Center
              </div>
              <h4 className="text-sm font-semibold text-white">View Submitted Messages</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                View messages submitted through the contact form.
              </p>
              <button
                id="toggle-inbox-btn"
                onClick={() => setShowInbox(!showInbox)}
                className="w-full mt-2 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-bold font-mono tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                {showInbox ? "Hide Messages" : "View Messages"}
              </button>
            </div>
          </div>

          {/* Contact Form Area (Columns 7) */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="bg-slate-900/60 border border-slate-850/90 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <h3 className="text-lg font-bold text-white mb-6">Send A Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2" htmlFor="contact-name">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="RAJESH KAMUJU"
                      className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-750 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2" htmlFor="contact-email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rkamuju39@gmail.com"
                      className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-750 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2" htmlFor="contact-message">
                    Message Body
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-slate-950 text-white border border-slate-800 hover:border-slate-750 focus:border-blue-500 rounded-xl p-4 text-sm resize-none focus:outline-none transition"
                  />
                </div>

                {/* Submission CTA */}
                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:bg-blue-700 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Submission API Responses feedback banner */}
                <AnimatePresence>
                  {apiResponse && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-4 rounded-xl border flex gap-3 text-sm mt-4 items-start ${
                        apiResponse.success 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border-red-500/20 text-red-500"
                      }`}
                    >
                      {apiResponse.success ? (
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold">{apiResponse.success ? "Message Sent" : "Submission Failed"}</div>
                        <div className="text-xs">{apiResponse.message}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>

            </div>

          </div>

        </div>

        {/* Real-time Submissions Audit Board Drawer */}
        <AnimatePresence>
          {showInbox && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-12 overflow-hidden border border-slate-800 rounded-2xl bg-slate-950/90 shadow-inner"
            >
              <div className="p-6 border-b border-slate-850/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessagesSquare className="text-blue-400 w-5 h-5" />
                  <h3 className="text-md sm:text-lg font-bold text-white uppercase tracking-wider font-mono">Submitted Messages</h3>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={fetchSubmittedMessages}
                    disabled={loadingInbox}
                    className="p-2 border border-slate-800 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingInbox ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowInbox(false)}
                    className="p-1 px-2.5 text-slate-400 hover:text-white rounded bg-slate-900 text-xs hover:bg-slate-850 transition"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[350px] overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center py-10 text-slate-500 text-sm font-mono">
                    No messages have been submitted yet.
                  </p>
                ) : (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={msg._id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-sm hover:border-slate-750 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{msg.name}</span>
                          <span className="text-xs font-mono text-slate-500">({msg.email})</span>
                        </div>
                        <p className="text-slate-355 text-slate-300 italic">"{msg.message}"</p>
                      </div>
                      <div className="text-[10px] sm:text-right text-slate-500 font-mono flex-shrink-0 self-end sm:self-auto uppercase">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Date Unknown"}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
