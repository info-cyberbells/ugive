import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import University from "./../src/models/university.model.js";
import College from "./../src/models/college.model.js";
import User from "./../src/models/user.model.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME });
    console.log("Connected to MongoDB");

    // Clear old data
    // await Promise.all([
    //   University.deleteMany({}),
    //   College.deleteMany({}),
    //   User.deleteMany({}),
    // ]);
    // console.log("Old data cleared");

    // Create University (USQ only)
    const universities = await University.create(
    {
      name: "University of Queensland",
      address_line_1: "5391 Warrego Hwy",
      address_line_2: "5391 Warrego Hwy",
      city: "Gatton",
      state: "QLD",
      postcode: "4343",
      shipping_address_name: "University of Queensland - Gatton",
      semester_length: 13,
    },
    {
      name: "University of Southern Queensland (UniSQ)",
      address_line_1: "487-535 West Street",
      address_line_2: "487-535 West Street",
      city: "Toowoomba",
      state: "QLD",
      postcode: "4350",
      shipping_address_name: "UniSQ - Toowoomba",
      semester_length: 13,
    });

    const usq = universities[1]; // UniSQ

    // Create College under USQ
    const usqScience = await College.create({
      name: "College of Science and Engineering",
      university: usq._id,
      address: "Toowoomba, QLD",
    });

    // Create Super Admin (system-level)
    // const superAdminPassword = await bcrypt.hash("SuperAdmin123", 10);
    // await User.create({
    //   name: "Super Admin",
    //   email: "superadmin@system.com",
    //   password: superAdminPassword,
    //   role: "super_admin",
    // });

    // Create University Admin (for USQ)
    // const usqAdminPassword = await bcrypt.hash("Admin123", 10);
    // await User.create({
    //   name: "USQ Admin",
    //   email: "admin@usq.edu.au",
    //   password: usqAdminPassword,
    //   role: "admin",
    //   university: usq._id,
    // });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
