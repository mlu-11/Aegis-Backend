import express from "express";
import Issue from "../models/Issue.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { projectId, sprintId } = req.query;
    const filter = {};

    if (projectId) filter.projectId = projectId;
    if (sprintId === "null") {
      filter.sprintId = null;
    } else if (sprintId) {
      filter.sprintId = sprintId;
    }

    const issues = await Issue.find(filter)
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user-stories", async (req, res) => {
  try {
    const { projectId, excludeId } = req.query;
    const filter = { type: "USER_STORY" };

    if (projectId) filter.projectId = projectId;
    if (excludeId) filter._id = { $ne: excludeId };

    const userStories = await Issue.find(filter)
      .populate("assigneeId reporterId", "name email avatar")
      .select("title type status priority assigneeId reporterId")
      .sort({ createdAt: -1 });
    res.json(userStories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const issue = new Issue(req.body);
    const newIssue = await issue.save();
    const populatedIssue = await Issue.findById(newIssue._id)
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/sprint", async (req, res) => {
  try {
    const { sprintId } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { sprintId: sprintId || null },
      { new: true, runValidators: true }
    )
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/bpmn/link", async (req, res) => {
  try {
    const { diagramId, elementId } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const exists = issue.linkedBPMNElements?.some(
      (element) =>
        element.diagramId === diagramId && element.elementId === elementId
    );

    if (!exists) {
      issue.linkedBPMNElements = issue.linkedBPMNElements || [];
      issue.linkedBPMNElements.push({ diagramId, elementId });
      await issue.save();
    }

    const populatedIssue = await Issue.findById(issue._id)
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    res.json(populatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id/bpmn/link", async (req, res) => {
  try {
    const { diagramId, elementId } = req.query;
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.linkedBPMNElements =
      issue.linkedBPMNElements?.filter(
        (element) =>
          !(element.diagramId === diagramId && element.elementId === elementId)
      ) || [];
    await issue.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    res.json(populatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/bpmn/element/:elementId", async (req, res) => {
  try {
    const issues = await Issue.find({
      "linkedBPMNElements.elementId": req.params.elementId,
    })
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/bpmn/diagram/:diagramId", async (req, res) => {
  try {
    const issues = await Issue.find({
      "linkedBPMNElements.diagramId": req.params.diagramId,
    })
      .populate("assigneeId reporterId", "name email avatar")
      .populate("dependencies.issueId", "title type status priority");
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
