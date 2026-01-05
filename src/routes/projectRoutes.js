import express from 'express';
import Project from '../models/Project.js';
import Issue from '../models/Issue.js';
import Sprint from '../models/Sprint.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('ownerId memberIds');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('ownerId memberIds');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    const newProject = await project.save();
    const populatedProject = await Project.findById(newProject._id).populate('ownerId memberIds');
    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ownerId memberIds');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Issue.deleteMany({ projectId: req.params.id });
    await Sprint.deleteMany({ projectId: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
