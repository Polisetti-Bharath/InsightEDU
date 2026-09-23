import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

import { Student } from "../src/models/Student";
import { Subject } from "../src/models/Subject";
import { Marks } from "../src/models/Marks";
import { User } from "../src/models/User";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable. Define it in .env.local.");
  process.exit(1);
}

const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH"] as const;

const SUBJECT_NAMES = [
  "Database Systems",
  "Operating Systems",
  "Computer Networks",
  "Data Structures",
  "Algorithms",
  "Machine Learning",
  "Cloud Computing",
  "Java Programming",
  "Python Programming",
  "Software Engineering",
];

function subjectCodeFor(index: number, department: (typeof DEPARTMENTS)[number]): string {
  return `${department}${300 + index}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string, { dbName: "insightedu" });

  console.log("Clearing existing data...");
  await Promise.all([
    Student.deleteMany({}),
    Subject.deleteMany({}),
    Marks.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("Seeding users...");
  const [adminPasswordHash, facultyPasswordHash] = await Promise.all([
    bcrypt.hash("Admin@123", 10),
    bcrypt.hash("Faculty@123", 10),
  ]);

  await User.create([
    {
      name: "Alex Admin",
      email: "admin@insightedu.app",
      passwordHash: adminPasswordHash,
      role: "admin",
    },
    {
      name: "Farah Faculty",
      email: "faculty@insightedu.app",
      passwordHash: facultyPasswordHash,
      role: "faculty",
    },
  ]);

  console.log("Seeding subjects...");
  const subjectDocs = await Subject.create(
    SUBJECT_NAMES.map((name, index) => ({
      subjectCode: subjectCodeFor(index, DEPARTMENTS[index % DEPARTMENTS.length]),
      subjectName: name,
      credits: randomInt(2, 5),
    })),
  );

  console.log("Seeding 100 students...");
  const usedEmails = new Set<string>();
  const usedStudentIds = new Set<string>();

  const studentInputs = Array.from({ length: 100 }).map((_, index) => {
    const department = DEPARTMENTS[index % DEPARTMENTS.length];
    const admissionYear = 21 + (index % 4);
    const studentId = `${admissionYear}${department}${String(index + 1).padStart(3, "0")}`;

    let email = faker.internet
      .email({ firstName: faker.person.firstName(), lastName: faker.person.lastName() })
      .toLowerCase();
    while (usedEmails.has(email)) {
      email = faker.internet.email().toLowerCase();
    }
    usedEmails.add(email);
    usedStudentIds.add(studentId);

    return {
      studentId,
      name: faker.person.fullName(),
      email,
      department,
      semester: randomInt(1, 8),
    };
  });

  const studentDocs = await Student.create(studentInputs);

  console.log("Seeding 1000 marks records...");
  const marksInputs: {
    studentId: mongoose.Types.ObjectId;
    subjectId: mongoose.Types.ObjectId;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
  }[] = [];

  const pairsSeen = new Set<string>();
  let attempts = 0;

  while (marksInputs.length < 1000 && attempts < 20000) {
    attempts += 1;
    const student = studentDocs[randomInt(0, studentDocs.length - 1)];
    const subject = subjectDocs[randomInt(0, subjectDocs.length - 1)];
    const pairKey = `${student._id.toString()}-${subject._id.toString()}`;

    if (pairsSeen.has(pairKey)) {
      continue;
    }
    pairsSeen.add(pairKey);

    const internalMarks = randomInt(15, 40);
    const externalMarks = randomInt(20, 60);

    marksInputs.push({
      studentId: student._id,
      subjectId: subject._id,
      internalMarks,
      externalMarks,
      totalMarks: internalMarks + externalMarks,
    });
  }

  await Marks.insertMany(marksInputs);

  console.log("Seed complete:");
  console.log(`  Users: 2 (admin@insightedu.app / faculty@insightedu.app)`);
  console.log(`  Subjects: ${subjectDocs.length}`);
  console.log(`  Students: ${studentDocs.length}`);
  console.log(`  Marks: ${marksInputs.length}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
