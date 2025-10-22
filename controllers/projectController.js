import Project from '../models/Project.js';

export const addProject = async (req, res) => {
  try {
    const { name, description, projectSlug, settings } = req.body;

    if (!projectSlug) {
      return res.status(400).json({ error: 'projectSlug is required' });
    }

    const existingProject = await Project.findOne({ projectSlug });
    if (existingProject) {
      return res.status(400).json({ error: 'Project slug already exists' });
    }

    const project = new Project({
      name,
      description,
      projectSlug,
      userId: req.userId,
      settings
    });

    await project.save();

    res.status(201).json({ 
      message: 'Project created successfully', 
      project 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectByUserID = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const projects = await Project.find({ userId });

    res.json({ 
      count: projects.length,
      projects 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectByID = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProjectByID = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { name, description, settings } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (settings) project.settings = { ...project.settings, ...settings };

    await project.save();

    res.json({ 
      message: 'Project updated successfully', 
      project 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProjectByID = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};