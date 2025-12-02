
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




// Create a new board
app.post("/api/boards", async (req, res) => {
  try {
    const { name, type,color, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: "Name and userId are required" });
    }


    const board = await prisma.board.create({
      data: {
        name,
        type: type || "Kanban",
        color: color || "#3B82F6",
        userId: parseInt(userId),
      },
    });

    
    // Define default lists for each template type
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
      await prisma.list.createMany({
        data: listsToCreate.map((title, index) => ({
          title,
          position: index,
          boardId: board.id
        }))
      });
    }

    // Fetch the board again to include list
    // const newBoard = await prisma.board.findUnique({
    //   where: { id: board.id },
    //   include: { lists: true },
    // });
    const newBoard = await prisma.board.findUnique({
      where: { id: board.id },
      include: {
        lists: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });

    res.status(201).json(newBoard);
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Failed to create board" });
  }
});

// Get all boards for a user with sorting, search, filtering, and pagination
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

    // Convert page and limit to integers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause = {
      userId: parseInt(userId)
    };

    // Add search filter if provided
    if (search && search.trim()) {
      whereClause.name = {
        contains: search.trim()
      };
    }

    // Add template filter if provided
    if (filterTemplate && filterTemplate !== 'all') {
      whereClause.type = filterTemplate;
    }

    // Determine the orderBy clause based on sortBy parameter
    let orderByClause;
    switch (sortBy) {
      case 'name':
        orderByClause = { name: order };
        break;
      case 'created':
        orderByClause = { createdAt: order };
        break;
      case 'updated':
        orderByClause = { updatedAt: order };
        break;
      default:
        orderByClause = { createdAt: 'desc' };
    }

    // Get total count for pagination
    const totalCount = await prisma.board.count({
      where: whereClause
    });

    // Get paginated boards
    const boards = await prisma.board.findMany({
      where: whereClause,
      include: {
        lists: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              orderBy: { position: "asc" },
            },
          },
        },
      },
      orderBy: orderByClause,
      skip: skip,
      take: limitNum,
    });

    // Return boards with pagination metadata
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

// Get a specific board
app.get("/api/boards/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const board = await prisma.board.findUnique({
      where: { id: parseInt(id) },
      include: {
        lists: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              orderBy: { position: "asc" },
            },
          },
        },
      },
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



// Update board 
app.put("/api/boards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, color } = req.body;

    const updatedBoard = await prisma.board.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(color && { color }),
      },
      include: {
        lists: {
          orderBy: { position: "asc" },
          include: { cards: { orderBy: { position: "asc" } } },
        },
      },
    });

    res.json(updatedBoard);
  } catch (err) {
    console.error("Error updating board:", err);
    res.status(500).json({ error: "Failed to update board" });
  }
});

// Delete board (cascade removes lists/cards via Prisma schema)
app.delete("/api/boards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.board.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error("Error deleting board:", err);
    res.status(500).json({ error: "Failed to delete board" });
  }
});



// Create list
app.post("/api/boards/:boardId/lists", async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, position = 0 } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required" });

    const list = await prisma.list.create({
      data: {
        title,
        position,
        boardId: parseInt(boardId),
      },
      include: { cards: true },
    });

    res.status(201).json(list);
  } catch (err) {
    console.error("Error creating list:", err);
    res.status(500).json({ error: "Failed to create list" });
  }
});

// Update list
app.put("/api/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, position } = req.body;

    const list = await prisma.list.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(position !== undefined && { position }),
      },
      include: { cards: true },
    });

    res.json(list);
  } catch (err) {
    console.error("Error updating list:", err);
    res.status(500).json({ error: "Failed to update list" });
  }
});

// Delete list
app.delete("/api/lists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.list.delete({ where: { id: parseInt(id) } });
    res.json({ message: "List deleted successfully" });
  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ error: "Failed to delete list" });
  }
});



// Create card
app.post("/api/lists/:listId/cards", async (req, res) => {
  try {
    const { listId } = req.params;
    const { title, description = "", position = 0 } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required" });

    const card = await prisma.card.create({
      data: {
        title,
        description,
        position,
        listId: parseInt(listId),
      },
    });

    res.status(201).json(card);
  } catch (err) {
    console.error("Error creating card:", err);
    res.status(500).json({ error: "Failed to create card" });
  }
});

// Update card
app.put("/api/cards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, position, listId } = req.body;

    const card = await prisma.card.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(position !== undefined && { position }),
        ...(listId && { listId: parseInt(listId) }), // enables moving cards
      },
    });

    res.json(card);
  } catch (err) {
    console.error("Error updating card:", err);
    res.status(500).json({ error: "Failed to update card" });
  }
});

// Delete card
app.delete("/api/cards/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.card.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Card deleted successfully" });
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

// Get all cards for a list
app.get("/api/lists/:listId/cards", async (req, res) => {
  try {
    const { listId } = req.params;

    const cards = await prisma.card.findMany({
      where: { listId: parseInt(listId) },
      orderBy: { position: "asc" },
    });

    res.json(cards);
  } catch (err) {
    console.error("Error fetching cards:", err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

// Get a specific card
app.get("/api/cards/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id: parseInt(id) },
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(card);
  } catch (err) {
    console.error("Error fetching card:", err);
    res.status(500).json({ error: "Failed to fetch card" });
  }
});   





const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



