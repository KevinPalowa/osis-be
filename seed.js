const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker/locale/id_ID");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Create Schools
  const schools = [];
  for (let i = 0; i < 3; i++) {
    const school = await prisma.school.create({
      data: {
        name: `School ${i + 1}`,
        address: faker.location.streetAddress(),
      },
    });
    schools.push(school);
  }

  // Create Admin User
  const hashedPassword = await bcrypt.hash("123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      schoolId: schools[0].id, // Associate admin with the first school
    },
  });

  // Create Students
  const studentPromises = [];
  for (let i = 0; i < 100; i++) {
    studentPromises.push(
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: hashedPassword,
          role: "STUDENT",
          grade: faker.helpers.arrayElement(["9th", "10th", "11th", "12th"]),
          schoolId: faker.helpers.arrayElement(schools).id, // Randomly associate with one of the schools
        },
      })
    );
  }
  const students = await Promise.all(studentPromises);

  // Create Candidates
  const candidatePromises = students.slice(0, 10).map((student) =>
    prisma.candidate.create({
      data: {
        userId: student.id,
        visi: faker.lorem.sentence(),
        biography: faker.lorem.paragraph(),
        misi: faker.lorem.sentence(),
        schoolId: student.schoolId, // Associate candidate with the same school as the user
      },
    })
  );
  await Promise.all(candidatePromises);


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
