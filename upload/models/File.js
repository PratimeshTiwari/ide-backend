
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['folder', 'file'],
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  language: {
    type: String
  },
  sizeInBytes: {
    type: Number
  }
}, {
  timestamps: true
});

fileSchema.index({ projectId: 1 });
fileSchema.index({ parentId: 1 });

export default mongoose.model('File', fileSchema);