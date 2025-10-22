import File from '../models/File.js';
import Project from '../models/Project.js';

export const addFiles = async (req, res) => {
  try {
    const { projectId, parentId, name, type, content, language } = req.body;

    if (!projectId || !name || !type) {
      return res.status(400).json({ error: 'projectId, name, and type are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    if (parentId) {
      const parentFile = await File.findById(parentId);
      if (!parentFile || parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Invalid parent folder' });
      }
    }

    const file = new File({
      projectId,
      parentId: parentId || null,
      name,
      type,
      content: type === 'file' ? (content || '') : undefined,
      language: type === 'file' ? language : undefined,
      sizeInBytes: type === 'file' && content ? Buffer.byteLength(content, 'utf8') : 0
    });

    await file.save();

    if (!parentId && type === 'folder' && !project.rootFolderId) {
      project.rootFolderId = file._id;
      await project.save();
    }

    res.status(201).json({ 
      message: 'File created successfully', 
      file 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getFiles = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('projectId');

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.projectId.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    res.json({ file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFiles = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('projectId');

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.projectId.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { name, content, language } = req.body;

    if (name) file.name = name;
    
    if (file.type === 'file') {
      if (content !== undefined) {
        file.content = content;
        file.sizeInBytes = Buffer.byteLength(content, 'utf8');
      }
      if (language) file.language = language;
    }

    await file.save();

    res.json({ 
      message: 'File updated successfully', 
      file 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFiles = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('projectId');

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.projectId.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    if (file.type === 'folder') {
      const childFiles = await File.find({ parentId: file._id });
      if (childFiles.length > 0) {
        return res.status(400).json({ error: 'Cannot delete folder with contents. Delete children first.' });
      }
    }

    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};