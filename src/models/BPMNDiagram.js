import mongoose from "mongoose";

const sprintSnapshotSchema = new mongoose.Schema(
  {
    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
      required: true,
    },
    sprintName: {
      type: String,
      required: true,
    },
    sprintNumber: {
      // optional, if you later add a "number" to your Sprint model
      type: Number,
    },
    takenAt: {
      type: Date,
      default: Date.now,
    },
    xml: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const bpmnDiagramSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    xml: {
      type: String,
      required: true,
    },

    lastCommittedXml: {
      // <-- ADDED: Field for storing the BPMN snapshot
      type: String,
    },

    //new :  all historical BPMN snapshots per sprint
    sprintSnapshots: {
      type: [sprintSnapshotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const sprintSchema = new mongoose.Schema(
  {
    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
      required: true,
    },
    sprintName: {
      type: String,
      required: true,
    },
    // optional "number" if you later want explicit sprint ordering
    sprintNumber: {
      type: Number,
    },
    takenAt: {
      type: Date,
      default: Date.now,
    },
    xml: {
      type: String,
      required: true,
    },
  },
  { _id: false } // embedded subdocs, no separate ids needed
);
export default mongoose.model("BPMNDiagram", bpmnDiagramSchema);
