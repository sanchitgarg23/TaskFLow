
import mongoose from 'mongoose';
import User from './models/User.js';
import Event from './models/Event.js';
import Board from './models/Board.js';
import List from './models/List.js';
import Card from './models/Card.js';
import 'dotenv/config';

async function seed() {
  console.log('Starting seed...');

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing data (in reverse order of dependencies)
    await Card.deleteMany({});
    await List.deleteMany({});
    await Board.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data');

    // Create a test user
    const user = new User({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "$2a$10$somehashedpassword", // You should hash this properly
      company: "Test Company",
      subscribeNewsletter: false,
    });
    await user.save();

    console.log('Created user:', user.id);

    // Seed events
    const eventsData = [
      {
        title: "Meeting with Team",
        description: "Discuss project milestones",
        type: "work",
        color: "#FF5733",
        startDate: new Date("2024-07-01T10:00:00Z"),
        endDate: new Date("2024-07-01T11:00:00Z"),
        allDay: false,
        userId: user.id,
      },
      {
        title: "Doctor Appointment",
        description: "Annual check-up",
        type: "personal",
        color: "#33FF57",
        startDate: new Date("2024-07-02T15:00:00Z"),
        endDate: new Date("2024-07-02T16:00:00Z"),
        allDay: true,
        userId: user.id,
      }
    ];

    for (const eventData of eventsData) {
        await new Event(eventData).save();
    }

    console.log('Created events');

    // Create a sample board
    const board = new Board({
      name: "My First Board",
      type: "Kanban",
      color: "#3B82F6",
      userId: user.id,
    });
    await board.save();

    console.log('Created board:', board.id);

    // Create lists for the board
    const listTitles = ["To Do", "In Progress", "Done"];
    const lists = [];

    for (let i = 0; i < listTitles.length; i++) {
        const list = new List({
            title: listTitles[i],
            position: i,
            boardId: board.id,
        });
        await list.save();
        lists.push(list);
    }

    console.log('Created lists');

    // Create sample cards for first list
    await new Card({
      title: "Sample Task 1",
      description: "This is a sample task",
      position: 0,
      listId: lists[0].id,
    }).save();

    await new Card({
      title: "Sample Task 2",
      description: "Another sample task",
      position: 1,
      listId: lists[0].id,
    }).save();

    console.log('Created cards');
    console.log('Seed completed successfully!');

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
