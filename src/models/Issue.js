import mongoose from "mongoose";

const linkedBPMNElementSchema = new mongoose.Schema(
  {
    diagramId: {
      type: String,
      required: true,
    },
    elementId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const customFieldSchema = new mongoose.Schema(
  {
    textField: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["TASK", "BUG", "USER_STORY"],
      required: true,
    },
    status: {
      type: String,
      enum: ["TO_DO", "IN_PROGRESS", "DONE"],
      default: "TO_DO",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
    },
    estimatedHours: {
      type: Number,
    },
    linkedBPMNElements: [linkedBPMNElementSchema],
    customFields: [customFieldSchema],
    // dependencies: [
    //   {
    //     //customize
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Issue",
    //   },
    // ],
    dependencies: [
      {
        issueId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Issue",
          required: true,
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],
    progress: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Issue", issueSchema);
