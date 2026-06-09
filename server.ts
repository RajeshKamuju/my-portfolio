import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up MongoDB Connection
let isMongoConnected = false;
const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
  console.log("Found MONGO_URI in process.env, connecting to MongoDB Atlas...");
  mongoose
    .connect(mongoURI, {
      dbName: "portfolioDB",
    })
    .then(() => {
      isMongoConnected = true;
      console.log("Successfully connected to MongoDB Atlas database 'portfolioDB'.");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB Atlas:", err.message);
      console.log("Falling back to local high-fidelity in-memory database.");
    });
} else {
  console.log("No MONGO_URI detected. Running in high-fidelity local memory fallback mode.");
}

// Mongoose Project Schema
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String }],
    image: { type: String },
    github: { type: String },
    demo: { type: String },
  },
  { timestamps: true }
);

const MongooseProject = mongoose.model("Project", projectSchema);

// Mongoose Contact Schema
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

const MongooseContact = mongoose.model("Contact", contactSchema);

// Local Memory Fail-Safe Seed Data for Portfolio
let localProjects = [
  {
    _id: "seed-1",
    title: "AI Chatbot",
    description: "A Java-based chatbot designed to answer frequently asked questions using rule-based techniques and NLP concepts.",
    skills: ["Java", "NLP", "Eclipse"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/RajeshKamuju",
    demo: "#",
    createdAt: new Date(),
  },

  {
    _id: "seed-2",
    title: "Job Portal",
    description: "A web application connecting job seekers and recruiters with features such as authentication and job applications.",
    skills: ["Java", "MySQL", "HTML", "CSS"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/RajeshKamuju",
    demo: "#",
    createdAt: new Date(),
  },

  {
    _id: "seed-3",
    title: "Personal Portfolio Website",
    description: "A full-stack portfolio website developed using React, Node.js, and MongoDB to showcase projects and technical skills.",
    skills: ["React", "TypeScript", "MongoDB"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/RajeshKamuju/my-portfolio",
    demo: "#",
    createdAt: new Date(),
  }
];

let localContacts: any[] = [
  {
    _id: "seed-msg-1",
    name: "John Doe",
    email: "john@example.com",
    message: "Hey! I am absolutely blown away by your VividCanvas tool. Would love to partner on an art project soon.",
    createdAt: new Date("2026-06-08T09:15:00Z"),
  }
];

// Helper to generate IDs for local mode
const generateLocalId = () => "local-" + Math.random().toString(36).substr(2, 9);

// API REST Endpoints

// GET /projects or GET /api/projects
const handleGetProjects = async (req: express.Request, res: express.Response) => {
  try {
    if (isMongoConnected) {
      const dbProjects = await MongooseProject.find().sort({ createdAt: -1 });
      res.json(dbProjects);
    } else {
      res.json(localProjects);
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch projects", details: err.message });
  }
};
app.get("/projects", handleGetProjects);
app.get("/api/projects", handleGetProjects);

// POST /projects or POST /api/projects
const handlePostProject = async (req: express.Request, res: express.Response) => {
  try {
    const { title, description, skills, image, github, demo } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required properties." });
    }

    const projectData = {
      title,
      description,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map((s: string) => s.trim()) : []),
      image: image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
      github: github || "",
      demo: demo || "",
    };

    if (isMongoConnected) {
      const newProject = new MongooseProject(projectData);
      await newProject.save();
      res.status(201).json(newProject);
    } else {
      const newProjectLocal = {
        _id: generateLocalId(),
        ...projectData,
        createdAt: new Date(),
      };
      localProjects.unshift(newProjectLocal);
      res.status(201).json(newProjectLocal);
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create project", details: err.message });
  }
};
app.post("/projects", handlePostProject);
app.post("/api/projects", handlePostProject);

// PUT /projects/:id or PUT /api/projects/:id
const handlePutProject = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { title, description, skills, image, github, demo } = req.body;

    const projectData = {
      title,
      description,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map((s: string) => s.trim()) : []),
      image,
      github,
      demo,
    };

    if (isMongoConnected) {
      const updatedProject = await MongooseProject.findByIdAndUpdate(id, projectData, { new: true });
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(updatedProject);
    } else {
      const index = localProjects.findIndex((p) => p._id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Project not found in local memory" });
      }
      localProjects[index] = {
        ...localProjects[index],
        ...projectData,
      };
      res.json(localProjects[index]);
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update project", details: err.message });
  }
};
app.put("/projects/:id", handlePutProject);
app.put("/api/projects/:id", handlePutProject);

// DELETE /projects/:id or DELETE /api/projects/:id
const handleDeleteProject = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const deletedProject = await MongooseProject.findByIdAndDelete(id);
      if (!deletedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ message: "Project successfully deleted", id });
    } else {
      const index = localProjects.findIndex((p) => p._id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Project not found in local memory" });
      }
      const deleted = localProjects.splice(index, 1);
      res.json({ message: "Project successfully deleted from memory", id });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete project", details: err.message });
  }
};
app.delete("/projects/:id", handleDeleteProject);
app.delete("/api/projects/:id", handleDeleteProject);

// POST /contact or POST /api/contact
const handlePostContact = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please fill in all required fields: name, email, message" });
    }

    const contactData = { name, email, message };

    if (isMongoConnected) {
      const newContact = new MongooseContact(contactData);
      await newContact.save();
      res.status(201).json({ success: true, message: "Thank you for reaching out! Your message was submitted successfully via MongoDB.", data: newContact });
    } else {
      const newContactLocal = {
        _id: generateLocalId(),
        ...contactData,
        createdAt: new Date(),
      };
      localContacts.unshift(newContactLocal);
      res.status(201).json({ success: true, message: "Message received in server memory backup mode! Set MONGO_URI to connect to MongoDB.", data: newContactLocal });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to register contact message", details: err.message });
  }
};
app.post("/contact", handlePostContact);
app.post("/api/contact", handlePostContact);

// GET API to inspect status and retrieve local contact messages (for complete full-stack control)
app.get("/api/status", (req, res) => {
  res.json({
    database: isMongoConnected ? "MongoDB Atlas" : "Local Memory Fallback",
    connected: isMongoConnected,
    mongoURI: mongoURI ? "Configured (Hidden)" : "Not Set",
  });
});

app.get("/api/messages", async (req, res) => {
  try {
    if (isMongoConnected) {
      const messages = await MongooseContact.find().sort({ createdAt: -1 });
      res.json(messages);
    } else {
      res.json(localContacts);
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch contact messages", details: err.message });
  }
});


// Serve React Frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom portfolio server running on port ${PORT}`);
    console.log(`Database connected state: ${isMongoConnected ? "MongoDB connected" : "Local Fallback"}`);
  });
}

startServer();
