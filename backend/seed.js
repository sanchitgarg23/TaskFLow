import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting seed...');

  // Clear existing data (in reverse order of dependencies)
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.board.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "$2a$10$somehashedpassword", // You should hash this properly
      company: "Test Company",
      subscribeNewsletter: false,
    },
  });

  console.log('Created user:', user.id);

  // Seed events
  const events = await prisma.event.createMany({
    data: [
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
        allDay: false,
        userId: user.id,
      }
    ]
  });

  console.log('Created events');

  // Create a sample board
  const board = await prisma.board.create({
    data: {
      name: "My First Board",
      type: "Kanban",
      color: "#3B82F6",
      userId: user.id,
    },
  });

  console.log('Created board:', board.id);

  // Create lists for the board
  const todoList = await prisma.list.create({
    data: {
      title: "To Do",
      position: 0,
      boardId: board.id,
    },
  });

  const inProgressList = await prisma.list.create({
    data: {
      title: "In Progress",
      position: 1,
      boardId: board.id,
    },
  });

  const doneList = await prisma.list.create({
    data: {
      title: "Done",
      position: 2,
      boardId: board.id,
    },
  });

  console.log('Created lists');

  // Create sample cards
  await prisma.card.create({
    data: {
      title: "Sample Task 1",
      description: "This is a sample task",
      position: 0,
      listId: todoList.id,
    },
  });

  await prisma.card.create({
    data: {
      title: "Sample Task 2",
      description: "Another sample task",
      position: 1,
      listId: todoList.id,
    },
  });

  console.log('Created cards');
  console.log('Seed completed successfully!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
