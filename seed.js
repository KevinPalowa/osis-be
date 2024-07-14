const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker/locale/id_ID");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const hashedPassword = await bcrypt.hash("123", 10);
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create Students
  for (let i = 0; i < 100; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: "STUDENT",
        grade: faker.helpers.arrayElement(["9th", "10th", "11th", "12th"]),
      },
    });
  }

  // Create Candidates
  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });

  for (const student of students.slice(0, 10)) {
    await prisma.candidate.create({
      data: {
        userId: student.id,
      },
    });
  }

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
