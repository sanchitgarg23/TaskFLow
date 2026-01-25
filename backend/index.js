
import 'dotenv/config';
import express from "express";
import cors from "cors";
import mongoose from "mongoose"; // Changed from PrismaClient
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/auth.js";

// Import Mongoose Models
import User from "./models/User.js";
import Event from "./models/Event.js";
import Board from "./models/Board.js";
import List from "./models/List.js";
import Card from "./models/Card.js";

const app = express();

// Database Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
const allowedOrigins = [
  "https://task-flow-one-sandy.vercel.app", // Deployed Frontend
  "http://localhost:5173",                  // Local Dev
  "http://localhost:5174",                  // Local Dev alt
  "https://taskflow-im15.onrender.com"      // Backend domain (MUST be added)
];

app.use(
  cors()
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend working (Mongoose)");
});


// --- Calendar Events API ---

app.get("/api/events", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    
    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/api/events", async (req, res) => {
  const { title, description, type, color, startDate, endDate, allDay, userId } = req.body;
  try {
    const event = new Event({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      type,
      color,
      allDay,
      userId
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create event", details: err.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated doc
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating event:", err.message);
    res.status(400).json({ error: "Failed to update event" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to delete event" });
  }
});

app.get("/api/events/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const query = type === 'all' ? {} : { type };
    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events by type" });
  }
});

app.get("/api/events/user/:userId/type/:type", async (req, res) => {
  try {
    const { userId, type } = req.params;
    const query = { userId };
    if (type !== 'all') query.type = type;
    
    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user events by type" });
  }
});

// Search Events
app.get("/api/events/search", async (req, res) => {
  try {
    const { q, type, userId } = req.query;
    const query = {};

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i'); // Case-insensitive regex
      query.$or = [{ title: regex }, { description: regex }];
    }

    if (type && type !== 'all') query.type = type;
    if (userId) query.userId = userId;

    const events = await Event.find(query).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search events" });
  }
});


// --- Auth API ---

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, company, password, subscribeNewsletter } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      company: company || "",
      password: hashedPassword,
      subscribeNewsletter: subscribeNewsletter || false,
    });
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
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

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
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

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You have access!", user: req.user });
});


// --- Board API ---

// Create Board
app.post("/api/boards", async (req, res) => {
  try {
    const { name, type, color, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: "Name and userId are required" });
    }

    const board = new Board({
      name,
      type: type || "Kanban",
      color: color || "#3B82F6",
      userId
    });
    await board.save();

    const templateLists = {
      "Kanban Board": ["To Do", "In Progress", "Done"],
      "Kanban": ["To Do", "In Progress", "Done"],
      "Project Management": ["Backlog", "Planning", "In Progress", "Review", "Complete"],
      "Sprint Planning": ["Sprint Backlog", "In Development", "Testing", "Done"],
      "Content Calendar": ["Ideas", "Writing", "Review", "Scheduled", "Published"],
      "Bug Tracking": ["Reported", "Investigating", "In Progress", "Testing", "Resolved"],
      "Personal Tasks": ["Today", "This Week", "Later", "Completed"]
    };

    const listsToCreate = templateLists[board.type] || templateLists["Kanban Board"];

    if (listsToCreate) {
      for (let i = 0; i < listsToCreate.length; i++) {
        await new List({
          title: listsToCreate[i],
          position: i,
          boardId: board.id
        }).save();
      }
    }

    // Populate lists and cards
    const newBoard = await Board.findById(board.id)
      .populate({
        path: 'lists',
        populate: { path: 'cards' }
      });

    res.status(201).json(newBoard);
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Failed to create board" });
  }
});

// Get all boards
app.get("/api/boards", async (req, res) => {
  try {
    const { 
      userId, 
      sortBy = 'created', 
      order = 'desc', 
      search = '', 
      filterTemplate = 'all',
      page = '1',
      limit = '12'
    } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { userId };

    if (search && search.trim()) {
      query.name = new RegExp(search.trim(), 'i');
    }

    if (filterTemplate && filterTemplate !== 'all') {
      query.type = filterTemplate;
    }

    const sortOptions = {};
    const sortOrder = order === 'desc' ? -1 : 1;
    if (sortBy === 'name') sortOptions.name = sortOrder;
    else if (sortBy === 'updated') sortOptions.updatedAt = sortOrder;
    else sortOptions.createdAt = sortOrder;

    const totalCount = await Board.countDocuments(query);

    const boards = await Board.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate({
        path: 'lists',
        populate: { path: 'cards' }
      });

    res.json({
      boards,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (err) {
    console.error("Error fetching boards:", err);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

// Get specific board
app.get("/api/boards/:id", async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate({
        path: 'lists',
        populate: { path: 'cards' }
      });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
  } catch (err) {
    console.error("Error fetching board:", err);
    res.status(500).json({ error: "Failed to fetch board" });
  }
});

// Update Board
app.put("/api/boards/:id", async (req, res) => {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate({
      path: 'lists',
      populate: { path: 'cards' }
    });
    res.json(updatedBoard);
  } catch (err) {
    console.error("Error updating board:", err);
    res.status(500).json({ error: "Failed to update board" });
  }
});

// Delete Board (and cascade children)
// Note: Mongoose middleware usually better for cascade, but doing manually for simplicity
app.delete("/api/boards/:id", async (req, res) => {
  try {
    const boardId = req.params.id;
    
    // Find all lists for this board
    const lists = await List.find({ boardId });
    const listIds = lists.map(l => l._id);
    
    // Delete all cards in these lists
    await Card.deleteMany({ listId: { $in: listIds } });
    
    // Delete lists
    await List.deleteMany({ boardId });
    
    // Delete board
    await Board.findByIdAndDelete(boardId);
    
    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error("Error deleting board:", err);
    res.status(500).json({ error: "Failed to delete board" });
  }
});


// --- List API ---

app.post("/api/boards/:boardId/lists", async (req, res) => {
  try {
    const { title, position = 0 } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const list = new List({
      title,
      position,
      boardId: req.params.boardId
    });
    await list.save();
    
    // Manual populate not strictly needed for just created list but keeping consistent return structure
    // Since it's new, it has no cards yet.
    const populatedList = list.toJSON(); 
    populatedList.cards = []; 
    
    res.status(201).json(populatedList);
  } catch (err) {
    console.error("Error creating list:", err);
    res.status(500).json({ error: "Failed to create list" });
  }
});

app.put("/api/lists/:id", async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('cards'); // Mongoose virtual population
    res.json(list);
  } catch (err) {
    console.error("Error updating list:", err);
    res.status(500).json({ error: "Failed to update list" });
  }
});

app.delete("/api/lists/:id", async (req, res) => {
  try {
    // Delete associated cards first
    await Card.deleteMany({ listId: req.params.id });
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: "List deleted successfully" });
  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ error: "Failed to delete list" });
  }
});


// --- Card API ---

app.post("/api/lists/:listId/cards", async (req, res) => {
  try {
    const { title, description = "", position = 0 } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const card = new Card({
      title,
      description,
      position,
      listId: req.params.listId
    });
    await card.save();
    res.status(201).json(card);
  } catch (err) {
    console.error("Error creating card:", err);
    res.status(500).json({ error: "Failed to create card" });
  }
});

app.put("/api/cards/:id", async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(card);
  } catch (err) {
    console.error("Error updating card:", err);
    res.status(500).json({ error: "Failed to update card" });
  }
});

app.delete("/api/cards/:id", async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted successfully" });
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

app.get("/api/lists/:listId/cards", async (req, res) => {
  try {
    const cards = await Card.find({ listId: req.params.listId }).sort({ position: 1 });
    res.json(cards);
  } catch (err) {
    console.error("Error fetching cards:", err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

app.get("/api/cards/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });
    res.json(card);
  } catch (err) {
    console.error("Error fetching card:", err);
    res.status(500).json({ error: "Failed to fetch card" });
  }
});


const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
