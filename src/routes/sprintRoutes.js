import express from "express";
import Sprint from "../models/Sprint.js";
import Issue from "../models/Issue.js";
import { completeSprint } from "../controllers/sprintController.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    const sprints = await Sprint.find(filter);
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/project/:projectId/active", async (req, res) => {
  try {
    const sprint = await Sprint.findOne({
      projectId: req.params.projectId,
      status: "ACTIVE",
    });
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const sprint = new Sprint(req.body);
    const newSprint = await sprint.save();
    res.status(201).json(newSprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }
    if (req.body.status === "COMPLETED") {
      // Find uncompleted issues and update their sprintId to null
      await Issue.updateMany(
        { sprintId: req.params.id, status: { $ne: "DONE" } },
        { sprintId: null }
      );
    }
    res.json(sprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/issues/:issueId", async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    if (!sprint.issueIds.includes(req.params.issueId)) {
      sprint.issueIds.push(req.params.issueId);
      await sprint.save();
    }

    await Issue.findByIdAndUpdate(req.params.issueId, {
      sprintId: req.params.id,
    });

    const updatedSprint = await Sprint.findById(sprint._id);
    res.json(updatedSprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id/issues/:issueId", async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    sprint.issueIds = sprint.issueIds.filter(
      (id) => id.toString() !== req.params.issueId
    );
    await sprint.save();

    await Issue.findByIdAndUpdate(req.params.issueId, {
      sprintId: null,
    });

    const updatedSprint = await Sprint.findById(sprint._id);
    res.json(updatedSprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    await Issue.updateMany({ sprintId: req.params.id }, { sprintId: null });

    await Sprint.findByIdAndDelete(req.params.id);
    res.json({ message: "Sprint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:sprintId/complete", completeSprint);

export default router;
