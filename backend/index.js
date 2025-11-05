import 'dotenv/config';  // ✅ replaces require("dotenv").config()
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

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
    console.error("Full error:", err);
    res.status(400).json({ 
      error: "Failed to update event",
      details: err.message 
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


const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
