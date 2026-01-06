import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Project from "./src/models/Project.js";
import Sprint from "./src/models/Sprint.js";
import Issue from "./src/models/Issue.js";
import BPMNDiagram from "./src/models/BPMNDiagram.js";
import BPMNElement from "./src/models/BPMNElement.js";
import BPMNElementStatus from "./src/models/BPMNElementStatus.js";
import bcrypt from "bcryptjs";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const sampleData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Project.deleteMany({});
    await Sprint.deleteMany({});
    await Issue.deleteMany({});
    await BPMNDiagram.deleteMany({});
    await BPMNElement.deleteMany({});
    await BPMNElementStatus.deleteMany({});

    console.log("Cleared existing data");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const users = await User.insertMany([
      {
        name: "user",
        email: "test@example.com",
        password: hashedPassword,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        avatar: "https://mui.com/static/images/avatar/2.jpg",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "password123",
        avatar: "https://mui.com/static/images/avatar/3.jpg",
      },
      {
        name: "Alice Brown",
        email: "alice@example.com",
        password: "password123",
        avatar: "https://mui.com/static/images/avatar/4.jpg",
      },
    ]);

    console.log("Users created:", users.length);

    const projects = await Project.insertMany([
      {
        name: "E-Commerce Platform",
        description:
          "Building a modern e-commerce platform with React and Node.js",
        ownerId: users[0]._id,
        memberIds: [users[0]._id, users[1]._id, users[2]._id],
      },
      {
        name: "Mobile App Development",
        description: "Cross-platform mobile application using React Native",
        ownerId: users[1]._id,
        memberIds: [users[1]._id, users[2]._id, users[3]._id],
      },
    ]);

    console.log("Projects created:", projects.length);

    const sprints = await Sprint.insertMany([
      {
        name: "Sprint 1",
        description: "Initial setup and core features",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-14"),
        projectId: projects[0]._id,
        issueIds: [],
        status: "COMPLETED",
      },
      {
        name: "Sprint 2",
        description: "User authentication and product catalog",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-01-28"),
        projectId: projects[0]._id,
        issueIds: [],
        status: "ACTIVE",
      },
      {
        name: "Sprint 1",
        description: "Mobile app foundation",
        startDate: new Date("2024-01-08"),
        endDate: new Date("2024-01-21"),
        projectId: projects[1]._id,
        issueIds: [],
        status: "PLANNING",
      },
    ]);

    console.log("Sprints created:", sprints.length);

    const issues = await Issue.insertMany([
      {
        title: "Setup project repository",
        description:
          "Initialize Git repository and setup basic project structure",
        type: "TASK",
        status: "DONE",
        priority: "HIGH",
        assigneeId: users[0]._id,
        reporterId: users[0]._id,
        projectId: projects[0]._id,
        sprintId: sprints[0]._id,
        estimatedHours: 4,
      },
      {
        title: "Design database schema",
        description:
          "Create ERD and define database schema for the application",
        type: "TASK",
        status: "DONE",
        priority: "HIGH",
        assigneeId: users[1]._id,
        reporterId: users[0]._id,
        projectId: projects[0]._id,
        sprintId: sprints[0]._id,
        estimatedHours: 8,
      },
      {
        title: "Implement user authentication",
        description: "Build login and registration functionality with JWT",
        type: "USER_STORY",
        status: "IN_PROGRESS",
        priority: "HIGH",
        assigneeId: users[1]._id,
        reporterId: users[0]._id,
        projectId: projects[0]._id,
        sprintId: sprints[1]._id,
        estimatedHours: 16,
      },
      {
        title: "Create product catalog API",
        description: "Build RESTful API endpoints for product management",
        type: "TASK",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assigneeId: users[2]._id,
        reporterId: users[0]._id,
        projectId: projects[0]._id,
        sprintId: sprints[1]._id,
        estimatedHours: 12,
      },
      {
        title: "Shopping cart functionality",
        description:
          "Implement add to cart, remove from cart, and cart persistence",
        type: "USER_STORY",
        status: "TO_DO",
        priority: "MEDIUM",
        assigneeId: users[2]._id,
        reporterId: users[0]._id,
        projectId: projects[0]._id,
        estimatedHours: 20,
      },
      {
        title: "Payment gateway integration",
        description: "Integrate Stripe payment processing",
        type: "TASK",
        status: "TO_DO",
        priority: "HIGH",
        assigneeId: users[1]._id,
        reporterId: users[0]._id,
        projectId: projects[0]._id,
        estimatedHours: 24,
      },
      {
        title: "Login page styling bug",
        description: "Fix responsive layout issues on mobile devices",
        type: "BUG",
        status: "TO_DO",
        priority: "URGENT",
        assigneeId: users[0]._id,
        reporterId: users[1]._id,
        projectId: projects[0]._id,
        sprintId: sprints[1]._id,
        estimatedHours: 3,
      },
      {
        title: "Setup React Native project",
        description: "Initialize React Native project with TypeScript",
        type: "TASK",
        status: "TO_DO",
        priority: "HIGH",
        assigneeId: users[2]._id,
        reporterId: users[1]._id,
        projectId: projects[1]._id,
        estimatedHours: 6,
      },
      {
        title: "Design mobile app UI",
        description: "Create Figma designs for all app screens",
        type: "TASK",
        status: "TO_DO",
        priority: "MEDIUM",
        assigneeId: users[3]._id,
        reporterId: users[1]._id,
        projectId: projects[1]._id,
        estimatedHours: 16,
      },
    ]);

    console.log("Issues created:", issues.length);

    await Sprint.findByIdAndUpdate(sprints[0]._id, {
      issueIds: [issues[0]._id, issues[1]._id],
    });

    await Sprint.findByIdAndUpdate(sprints[1]._id, {
      issueIds: [issues[2]._id, issues[3]._id, issues[6]._id],
    });

    const bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_1" name="Start">
      <bpmn2:outgoing>Flow_1</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Task_1" name="Project Setup">
      <bpmn2:incoming>Flow_1</bpmn2:incoming>
      <bpmn2:outgoing>Flow_2</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_2" name="Database Design">
      <bpmn2:incoming>Flow_2</bpmn2:incoming>
      <bpmn2:outgoing>Flow_3</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_3" name="Authentication">
      <bpmn2:incoming>Flow_3</bpmn2:incoming>
      <bpmn2:outgoing>Flow_4</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_4" name="Product Catalog">
      <bpmn2:incoming>Flow_4</bpmn2:incoming>
      <bpmn2:outgoing>Flow_5</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_5" name="Shopping Cart">
      <bpmn2:incoming>Flow_5</bpmn2:incoming>
      <bpmn2:outgoing>Flow_6</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:task id="Task_6" name="Payment Integration">
      <bpmn2:incoming>Flow_6</bpmn2:incoming>
      <bpmn2:outgoing>Flow_7</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:endEvent id="EndEvent_1" name="End">
      <bpmn2:incoming>Flow_7</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn2:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Task_2" />
    <bpmn2:sequenceFlow id="Flow_3" sourceRef="Task_2" targetRef="Task_3" />
    <bpmn2:sequenceFlow id="Flow_4" sourceRef="Task_3" targetRef="Task_4" />
    <bpmn2:sequenceFlow id="Flow_5" sourceRef="Task_4" targetRef="Task_5" />
    <bpmn2:sequenceFlow id="Flow_6" sourceRef="Task_5" targetRef="Task_6" />
    <bpmn2:sequenceFlow id="Flow_7" sourceRef="Task_6" targetRef="EndEvent_1" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="79" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1" bpmnElement="Task_1">
        <dc:Bounds x="270" y="57" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_2" bpmnElement="Task_2">
        <dc:Bounds x="420" y="57" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_3" bpmnElement="Task_3">
        <dc:Bounds x="570" y="57" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_4" bpmnElement="Task_4">
        <dc:Bounds x="720" y="57" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_5" bpmnElement="Task_5">
        <dc:Bounds x="870" y="57" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_6" bpmnElement="Task_6">
        <dc:Bounds x="1020" y="57" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1" bpmnElement="EndEvent_1">
        <dc:Bounds x="1172" y="79" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="97" />
        <di:waypoint x="270" y="97" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="97" />
        <di:waypoint x="420" y="97" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="520" y="97" />
        <di:waypoint x="570" y="97" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="670" y="97" />
        <di:waypoint x="720" y="97" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="820" y="97" />
        <di:waypoint x="870" y="97" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="970" y="97" />
        <di:waypoint x="1020" y="97" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_7_di" bpmnElement="Flow_7">
        <di:waypoint x="1120" y="97" />
        <di:waypoint x="1172" y="97" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;

    const diagrams = await BPMNDiagram.insertMany([
      {
        name: "E-Commerce Development Workflow",
        description:
          "Complete development workflow for the e-commerce platform",
        projectId: projects[0]._id,
        xml: bpmnXml,
      },
    ]);

    console.log("BPMN Diagrams created:", diagrams.length);

    const elements = await BPMNElement.insertMany([
      {
        diagramId: diagrams[0]._id,
        elementId: "Task_1",
        type: "task",
        name: "Project Setup",
        linkedIssueIds: [issues[0]._id],
      },
      {
        diagramId: diagrams[0]._id,
        elementId: "Task_2",
        type: "task",
        name: "Database Design",
        linkedIssueIds: [issues[1]._id],
      },
      {
        diagramId: diagrams[0]._id,
        elementId: "Task_3",
        type: "task",
        name: "Authentication",
        linkedIssueIds: [issues[2]._id],
      },
      {
        diagramId: diagrams[0]._id,
        elementId: "Task_4",
        type: "task",
        name: "Product Catalog",
        linkedIssueIds: [issues[3]._id],
      },
      {
        diagramId: diagrams[0]._id,
        elementId: "Task_5",
        type: "task",
        name: "Shopping Cart",
        linkedIssueIds: [issues[4]._id],
      },
      {
        diagramId: diagrams[0]._id,
        elementId: "Task_6",
        type: "task",
        name: "Payment Integration",
        linkedIssueIds: [issues[5]._id],
      },
    ]);

    console.log("BPMN Elements created:", elements.length);

    await Issue.findByIdAndUpdate(issues[0]._id, {
      linkedBPMNElements: [
        { diagramId: diagrams[0]._id.toString(), elementId: "Task_1" },
      ],
    });
    await Issue.findByIdAndUpdate(issues[1]._id, {
      linkedBPMNElements: [
        { diagramId: diagrams[0]._id.toString(), elementId: "Task_2" },
      ],
    });
    await Issue.findByIdAndUpdate(issues[2]._id, {
      linkedBPMNElements: [
        { diagramId: diagrams[0]._id.toString(), elementId: "Task_3" },
      ],
    });
    await Issue.findByIdAndUpdate(issues[3]._id, {
      linkedBPMNElements: [
        { diagramId: diagrams[0]._id.toString(), elementId: "Task_4" },
      ],
    });
    await Issue.findByIdAndUpdate(issues[4]._id, {
      linkedBPMNElements: [
        { diagramId: diagrams[0]._id.toString(), elementId: "Task_5" },
      ],
    });
    await Issue.findByIdAndUpdate(issues[5]._id, {
      linkedBPMNElements: [
        { diagramId: diagrams[0]._id.toString(), elementId: "Task_6" },
      ],
    });

    const statuses = await BPMNElementStatus.insertMany([
      {
        elementId: "Task_1",
        status: "completed",
        progress: 100,
        lastUpdated: new Date(),
      },
      {
        elementId: "Task_2",
        status: "completed",
        progress: 100,
        lastUpdated: new Date(),
      },
      {
        elementId: "Task_3",
        status: "in_progress",
        progress: 50,
        lastUpdated: new Date(),
      },
      {
        elementId: "Task_4",
        status: "in_progress",
        progress: 30,
        lastUpdated: new Date(),
      },
      {
        elementId: "Task_5",
        status: "not_started",
        progress: 0,
        lastUpdated: new Date(),
      },
      {
        elementId: "Task_6",
        status: "not_started",
        progress: 0,
        lastUpdated: new Date(),
      },
    ]);

    console.log("BPMN Element Statuses created:", statuses.length);

    console.log("\nSample data created successfully!");
    console.log(`- ${users.length} users`);
    console.log(`- ${projects.length} projects`);
    console.log(`- ${sprints.length} sprints`);
    console.log(`- ${issues.length} issues`);
    console.log(`- ${diagrams.length} BPMN diagrams`);
    console.log(`- ${elements.length} BPMN elements`);
    console.log(`- ${statuses.length} BPMN element statuses`);

    process.exit(0);
  } catch (error) {
    console.error("Error creating sample data:", error);
    process.exit(1);
  }
};

sampleData();
