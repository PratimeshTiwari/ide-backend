import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectSlug: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  rootFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  settings: {
    framework: {
      type: String,
      default: 'react'
    },
    autoSave: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

projectSchema.index({ projectSlug: 1 });
projectSchema.index({ userId: 1 });

export default mongoose.model('Project', projectSchema);