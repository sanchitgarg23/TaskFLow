
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
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});



// Add a new event
app.post("/api/events", async (req, res) => {
  const { title, description, type, color, startDate, endDate } = req.body;
  try {
    console.log("📥 Received event data:", JSON.stringify(req.body, null, 2));
    const event = await prisma.event.create({ data: req.body });
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create event" });
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


// signup 

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, company, password, subscribeNewsletter } = req.body;


    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }


    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


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

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
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




const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



