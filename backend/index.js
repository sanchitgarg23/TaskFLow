
import 'dotenv/config';
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/auth.js";
const prisma = new PrismaClient();
const app = express();




// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend working");
});


// this is for calander

app.get("/api/events", async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query params
    
    const whereClause = {};
    
    // Only filter by userId if provided
    if (userId) {
      whereClause.userId = parseInt(userId);
    }
    
    const events = await prisma.event.findMany({
      where: whereClause
    });
    
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});


// to create
app.post("/api/events", async (req, res) => {
  const { title, description, type, color, startDate, endDate, allDay, userId } = req.body;
  // ✅ Added allDay
  
  try {
    console.log("Received event data:", JSON.stringify(req.body, null, 2));

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        color,
        allDay, // ✅ Added allDay
        userId
      },
    });
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create event", details: err.message });
  }
});

// Update event
app.put("/api/events/:id", async (req, res) => {
  try {
    console.log("Update request for event:", req.params.id);
    console.log("Update data:", req.body);
    
    const updated = await prisma.event.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    
    console.log("✅ Event updated:", updated);
    res.json(updated);
  } catch (err) {
    console.error("Error updating event:", err.message);

    res.status(400).json({ 
      error: "Failed to update event",

    });
  }
});

// Delete event
app.delete("/api/events/:id", async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to delete event" });
  }
});

// Add this new route after your existing event routes

// Get events by type (for filtering)
app.get("/api/events/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    
    let events;
    if (type === 'all') {
      events = await prisma.event.findMany();
    } else {
      events = await prisma.event.findMany({
        where: { type: type }
      });
    }
    
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events by type" });
  }
});


// this i made for filtering the events by user and type like deadline , task , etc in calander page.
// Get events by user and type (if you want user-specific filtering)
app.get("/api/events/user/:userId/type/:type", async (req, res) => {
  try {
    const { userId, type } = req.params;
    
    let events;
    if (type === 'all') {
      events = await prisma.event.findMany({
        where: { userId: parseInt(userId) }
      });
    } else {
      events = await prisma.event.findMany({
        where: { 
          userId: parseInt(userId),
          type: type 
        }
      });
    }
    
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user events by type" });
  }
});


// signup 
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, company, password, subscribeNewsletter } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        company: company || "",
        password: hashedPassword,
        subscribeNewsletter: subscribeNewsletter || false,
      },
    });

    // Generate token (uncommented and fixed)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token: token, // Fixed: now token is properly defined
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("Signup error:", err); 
    res.status(500).json({ error: "Server error during signup" });
  }
});


// login 


app.post("/api/auth/login", async (req, res) => {
  try {
    const {email,password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Emailand password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const compare_kar = await bcrypt.compare(password, user.password);
    if (!compare_kar)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// to check the logi and sighup backend working properly
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You have access!", user: req.user });
});



// now this will be for search in calander page
app.get("/api/events/search", async (req, res) => {
  try {
    const { q, type, userId } = req.query;
    
    // Build the where clause
    const whereClause = {};
    
    // Remove mode: 'insensitive' - MySQL doesn't support it
    if (q && q.trim()) {
      whereClause.OR = [
        { title: { contains: q.trim() } },
        { description: { contains: q.trim() } }
      ];
    }
    
    // Add type filter if provided
    if (type && type !== 'all') {
      whereClause.type = type;
    }
    
    // Add user filter if provided
    if (userId) {
      whereClause.userId = parseInt(userId);
    }
    
    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { startDate: 'asc' }
    });
    
    res.json(events);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search events" });
  }
});


const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



