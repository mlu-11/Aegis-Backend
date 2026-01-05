import Sprint from "../models/Sprint.js";
import Issue from "../models/Issue.js";
import BPMNDiagram from "../models/BPMNDiagram.js";

export const completeSprint = async (req, res) => {
  try {
    // router uses :sprintId, but be robust either way
    const sprintId = req.params.sprintId || req.params.id;

    if (!sprintId) {
      return res.status(400).json({ message: "Sprint ID is required" });
    }

    const sprint = await Sprint.findById(sprintId);

    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    // If already completed, no need to snapshot again
    if (sprint.status === "COMPLETED") {
      return res.status(400).json({ message: "Sprint is already completed" });
    }

    // 1) Mark sprint as COMPLETED
    sprint.status = "COMPLETED";
    sprint.completedAt = new Date();
    await sprint.save();

    // 2) Unassign non-DONE issues from this sprint
    await Issue.updateMany(
      { sprintId: sprint._id, status: { $ne: "DONE" } },
      { sprintId: null }
    );

    // 3) Snapshot all BPMN diagrams for this sprint's project
    if (!sprint.projectId) {
      console.warn(
        "[completeSprint] Sprint has no projectId, skipping BPMN snapshotting."
      );
    } else {
      const diagrams = await BPMNDiagram.find({ projectId: sprint.projectId });
      const timestamp = new Date();

      await Promise.all(
        diagrams.map(async (diagram) => {
          // Some diagrams may not have XML yet → just skip
          if (!diagram.xml) {
            console.warn(
              `[completeSprint] Diagram ${diagram._id} has no xml, skipping snapshot.`
            );
            return;
          }

          if (!Array.isArray(diagram.sprintSnapshots)) {
            diagram.sprintSnapshots = [];
          }

          diagram.sprintSnapshots.push({
            sprintId: sprint._id,
            sprintName: sprint.name,
            sprintNumber: sprint.number, // if you have a 'number' field, otherwise remove
            takenAt: timestamp,
            xml: diagram.xml,
          });

          // Also update "latest baseline"
          diagram.lastCommittedXml = diagram.xml;

          await diagram.save();
        })
      );
    }

    return res.json({
      message: "Sprint completed and BPMN snapshots recorded",
      sprint,
    });
  } catch (err) {
    console.error("[completeSprint] Error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
