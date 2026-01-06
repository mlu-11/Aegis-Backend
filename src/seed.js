//for test purpose

import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "./models/Project.js";
import User from "./models/User.js";
import BPMNDiagram from "./models/BPMNDiagram.js";
import Issue from "./models/Issue.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Create a Master Admin User (or use your own ID)
    const admin = await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: "hashed_password_here", // Remember to hash this if using bcrypt
    });

    // 2. Initialize the Project
    const project = await Project.create({
      name: "Test  Project",
      description: "Initial test environment for questionnaire",
      ownerId: admin._id,
      memberIds: [admin._id], // You can add friends' IDs here later
    });

    // 3. Initialize the BPMN Model
    const diagram = await BPMNDiagram.create({
      name: "Core Business Process",
      projectId: project._id,
      xml: "<?xml version='1.0' encoding='UTF-8'?><bpmn:definitions ...>",
    });

    // 4. Initialize Issues linked to the BPMN
    await Issue.create({
      title: "Implement Login",
      type: "USER_STORY",
      projectId: project._id,
      reporterId: admin._id,
      linkedBPMNElements: [
        {
          diagramId: diagram._id.toString(),
          elementId: "Activity_1", // Must match an ID in your XML
        },
      ],
    });

    console.log("Data Initialized successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
