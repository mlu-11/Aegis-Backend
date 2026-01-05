# Aegis Backend API

Backend API for the Aegis project management system built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system

3. The `.env` file is already created with default settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aegis
NODE_ENV=development
```

4. Populate the database with sample data:
```bash
npm run sample
```

This will create sample users, projects, sprints, issues, and BPMN diagrams in your MongoDB database.

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload
- `npm run sample` - Populate database with sample data

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (cascades to issues and sprints)

### Issues
- `GET /api/issues` - Get all issues (filter by projectId, sprintId)
- `GET /api/issues/:id` - Get issue by ID
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id` - Update issue
- `PATCH /api/issues/:id/status` - Update issue status
- `PATCH /api/issues/:id/sprint` - Assign issue to sprint
- `POST /api/issues/:id/bpmn/link` - Link issue to BPMN element
- `DELETE /api/issues/:id/bpmn/link` - Unlink issue from BPMN element
- `GET /api/issues/bpmn/element/:elementId` - Get issues by BPMN element
- `GET /api/issues/bpmn/diagram/:diagramId` - Get issues by BPMN diagram
- `DELETE /api/issues/:id` - Delete issue

### Sprints
- `GET /api/sprints` - Get all sprints (filter by projectId)
- `GET /api/sprints/:id` - Get sprint by ID
- `GET /api/sprints/project/:projectId/active` - Get active sprint for project
- `POST /api/sprints` - Create new sprint
- `PUT /api/sprints/:id` - Update sprint
- `POST /api/sprints/:id/issues/:issueId` - Add issue to sprint
- `DELETE /api/sprints/:id/issues/:issueId` - Remove issue from sprint
- `DELETE /api/sprints/:id` - Delete sprint

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### BPMN
- `GET /api/bpmn/diagrams` - Get all diagrams (filter by projectId)
- `GET /api/bpmn/diagrams/:id` - Get diagram by ID
- `POST /api/bpmn/diagrams` - Create new diagram
- `PUT /api/bpmn/diagrams/:id` - Update diagram
- `DELETE /api/bpmn/diagrams/:id` - Delete diagram
- `GET /api/bpmn/elements` - Get all elements (filter by diagramId)
- `GET /api/bpmn/elements/:id` - Get element by ID
- `POST /api/bpmn/elements` - Create new element
- `PUT /api/bpmn/elements/:id` - Update element
- `DELETE /api/bpmn/elements/:id` - Delete element
- `POST /api/bpmn/elements/:id/issues/:issueId` - Link issue to element
- `DELETE /api/bpmn/elements/:id/issues/:issueId` - Unlink issue from element
- `GET /api/bpmn/statuses` - Get all element statuses
- `GET /api/bpmn/statuses/:elementId` - Get element status
- `PUT /api/bpmn/statuses/:elementId` - Update element status
- `POST /api/bpmn/statuses/update-from-issues` - Update element statuses from issues

### Health Check
- `GET /api/health` - Check server health

## Data Models

### Project
- name: String (required)
- description: String (required)
- ownerId: ObjectId (required, ref: User)
- memberIds: Array of ObjectId (ref: User)
- timestamps: createdAt, updatedAt

### Issue
- title: String (required)
- description: String (required)
- type: String (TASK | BUG | USER_STORY)
- status: String (TO_DO | IN_PROGRESS | DONE)
- priority: String (LOW | MEDIUM | HIGH | URGENT)
- assigneeId: ObjectId (ref: User)
- reporterId: ObjectId (required, ref: User)
- projectId: ObjectId (required, ref: Project)
- sprintId: ObjectId (ref: Sprint)
- estimatedHours: Number
- linkedBPMNElements: Array of {diagramId, elementId}
- timestamps: createdAt, updatedAt

### Sprint
- name: String (required)
- description: String (required)
- startDate: Date (required)
- endDate: Date (required)
- projectId: ObjectId (required, ref: Project)
- issueIds: Array of ObjectId (ref: Issue)
- status: String (PLANNING | ACTIVE | COMPLETED)
- timestamps: createdAt, updatedAt

### User
- name: String (required)
- email: String (required, unique)
- avatar: String

### BPMNDiagram
- name: String (required)
- description: String (required)
- projectId: ObjectId (required, ref: Project)
- xml: String (required)
- timestamps: createdAt, updatedAt

### BPMNElement
- diagramId: ObjectId (required, ref: BPMNDiagram)
- elementId: String (required)
- type: String (task | gateway | event | subprocess)
- name: String (required)
- linkedIssueIds: Array of ObjectId (ref: Issue)

### BPMNElementStatus
- elementId: String (required, unique)
- status: String (not_started | in_progress | completed | blocked)
- progress: Number (0-100)
- lastUpdated: Date
