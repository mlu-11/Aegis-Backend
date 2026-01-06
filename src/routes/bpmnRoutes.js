import express from "express";
import BPMNDiagram from "../models/BPMNDiagram.js";
import BPMNElement from "../models/BPMNElement.js";
import BPMNElementStatus from "../models/BPMNElementStatus.js";
import BPMNChangeLog from "../models/BPMNChangeLog.js";
import Issue from "../models/Issue.js";

const router = express.Router();

router.get("/diagrams", async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    const diagrams = await BPMNDiagram.find(filter);
    res.json(diagrams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/diagrams/:id", async (req, res) => {
  try {
    const diagram = await BPMNDiagram.findById(req.params.id);
    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found" });
    }
    res.json(diagram);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/diagrams", async (req, res) => {
  try {
    const diagram = new BPMNDiagram(req.body);
    const newDiagram = await diagram.save();
    res.status(201).json(newDiagram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/diagrams/:id", async (req, res) => {
  try {
    const diagram = await BPMNDiagram.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found" });
    }
    res.json(diagram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/diagrams/:id", async (req, res) => {
  try {
    const diagram = await BPMNDiagram.findById(req.params.id);
    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found" });
    }

    await BPMNElement.deleteMany({ diagramId: req.params.id });
    await BPMNDiagram.findByIdAndDelete(req.params.id);

    res.json({ message: "Diagram deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//////

// <-- ADDED: DELETE endpoint for Change Logs，resets the change history for the new iteration.
router.delete("/diagrams/:id/changes", async (req, res) => {
  try {
    const bpmnDiagramId = req.params.id;
    await BPMNChangeLog.deleteMany({ bpmnDiagramId });
    res.json({ message: "Change logs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// --> End of Added DELETE endpoint

router.get("/elements", async (req, res) => {
  try {
    const { diagramId } = req.query;
    const filter = diagramId ? { diagramId } : {};
    const elements = await BPMNElement.find(filter);
    res.json(elements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/elements/:id", async (req, res) => {
  try {
    const element = await BPMNElement.findById(req.params.id);
    if (!element) {
      return res.status(404).json({ message: "Element not found" });
    }
    res.json(element);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/elements", async (req, res) => {
  try {
    const element = new BPMNElement(req.body);
    const newElement = await element.save();
    res.status(201).json(newElement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/elements/:id", async (req, res) => {
  try {
    const element = await BPMNElement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!element) {
      return res.status(404).json({ message: "Element not found" });
    }
    res.json(element);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/elements/:id", async (req, res) => {
  try {
    const element = await BPMNElement.findByIdAndDelete(req.params.id);
    if (!element) {
      return res.status(404).json({ message: "Element not found" });
    }
    res.json({ message: "Element deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/elements/:id/issues/:issueId", async (req, res) => {
  try {
    const element = await BPMNElement.findById(req.params.id);
    if (!element) {
      return res.status(404).json({ message: "Element not found" });
    }

    if (!element.linkedIssueIds.includes(req.params.issueId)) {
      element.linkedIssueIds.push(req.params.issueId);
      await element.save();
    }

    const issue = await Issue.findById(req.params.issueId);
    if (issue) {
      const exists = issue.linkedBPMNElements?.some(
        (el) =>
          el.diagramId === element.diagramId.toString() &&
          el.elementId === element.elementId
      );
      if (!exists) {
        issue.linkedBPMNElements = issue.linkedBPMNElements || [];
        issue.linkedBPMNElements.push({
          diagramId: element.diagramId.toString(),
          elementId: element.elementId,
        });
        await issue.save();
      }
    }

    const updatedElement = await BPMNElement.findById(element._id);
    res.json(updatedElement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//%%%%%%%%%
// <-- ADDED: PATCH endpoint for partial updates (used for saving lastCommittedXml)
router.patch("/diagrams/:id", async (req, res) => {
  try {
    // Use findByIdAndUpdate to apply partial updates
    const diagram = await BPMNDiagram.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found" });
    }
    res.json(diagram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// --> End of Added PATCH endpoint

router.delete("/elements/:id/issues/:issueId", async (req, res) => {
  try {
    const element = await BPMNElement.findById(req.params.id);
    if (!element) {
      return res.status(404).json({ message: "Element not found" });
    }

    element.linkedIssueIds = element.linkedIssueIds.filter(
      (id) => id.toString() !== req.params.issueId
    );
    await element.save();

    const issue = await Issue.findById(req.params.issueId);
    if (issue) {
      issue.linkedBPMNElements =
        issue.linkedBPMNElements?.filter(
          (el) =>
            !(
              el.diagramId === element.diagramId.toString() &&
              el.elementId === element.elementId
            )
        ) || [];
      await issue.save();
    }

    const updatedElement = await BPMNElement.findById(element._id);
    res.json(updatedElement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/statuses", async (req, res) => {
  try {
    const statuses = await BPMNElementStatus.find();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/statuses/:elementId", async (req, res) => {
  try {
    const status = await BPMNElementStatus.findOne({
      elementId: req.params.elementId,
    });
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/statuses/:elementId", async (req, res) => {
  try {
    const status = await BPMNElementStatus.findOneAndUpdate(
      { elementId: req.params.elementId },
      { ...req.body, lastUpdated: new Date() },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(status);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/statuses/update-from-issues", async (req, res) => {
  try {
    const { issueIds } = req.body;
    const issues = await Issue.find({ _id: { $in: issueIds } });

    const elementStatusMap = {};

    issues.forEach((issue) => {
      issue.linkedBPMNElements?.forEach((link) => {
        const key = link.elementId;
        if (!elementStatusMap[key]) {
          elementStatusMap[key] = {
            total: 0,
            done: 0,
            inProgress: 0,
            toDo: 0,
          };
        }
        elementStatusMap[key].total++;
        if (issue.status === "DONE") {
          elementStatusMap[key].done++;
        } else if (issue.status === "IN_PROGRESS") {
          elementStatusMap[key].inProgress++;
        } else {
          elementStatusMap[key].toDo++;
        }
      });
    });

    const updates = [];
    for (const [elementId, stats] of Object.entries(elementStatusMap)) {
      let status = "not_started";
      let progress = 0;

      if (stats.done === stats.total) {
        status = "completed";
        progress = 100;
      } else if (stats.inProgress > 0 || stats.done > 0) {
        status = "in_progress";
        progress = Math.round((stats.done / stats.total) * 100);
      }

      const updated = await BPMNElementStatus.findOneAndUpdate(
        { elementId },
        { status, progress, lastUpdated: new Date() },
        { new: true, upsert: true, runValidators: true }
      );
      updates.push(updated);
    }

    res.json(updates);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/diagrams/:id/changes", async (req, res) => {
  try {
    const { changes } = req.body;
    const bpmnDiagramId = req.params.id;

    const savedLogs = [];
    const timeThreshold = new Date(Date.now() - 5000);

    for (const change of changes) {
      const existingLog = await BPMNChangeLog.findOne({
        bpmnDiagramId,
        elementId: change.elementId,
        changeType: change.changeType,
        createdAt: { $gte: timeThreshold },
      });

      if (!existingLog) {
        const changeLog = new BPMNChangeLog({
          bpmnDiagramId,
          elementId: change.elementId,
          elementName: change.elementName || "",
          elementType: change.elementType,
          changeType: change.changeType,
        });

        const savedLog = await changeLog.save();
        savedLogs.push(savedLog);
      }
    }

    res.status(201).json(savedLogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/diagrams/:id/changes", async (req, res) => {
  try {
    const bpmnDiagramId = req.params.id;
    const changes = await BPMNChangeLog.find({ bpmnDiagramId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(changes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the previous sprint's snapshot for a diagram
router.get("/diagrams/:id/previous-sprint-snapshot", async (req, res) => {
  try {
    const diagram = await BPMNDiagram.findById(req.params.id);
    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found" });
    }

    // Get snapshots sorted by date (most recent first)
    const snapshots = diagram.sprintSnapshots || [];

    if (snapshots.length === 0) {
      return res.status(404).json({ message: "No sprint snapshots found" });
    }

    // Sort by takenAt descending (most recent first)
    const sortedSnapshots = snapshots.sort(
      (a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
    );

    // Get the second most recent snapshot (index 1)
    // If there's only one snapshot, return it
    const previousSnapshot =
      sortedSnapshots.length > 1 ? sortedSnapshots[1] : sortedSnapshots[0];

    res.json(previousSnapshot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
