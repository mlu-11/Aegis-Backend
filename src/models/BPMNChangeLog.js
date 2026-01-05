import mongoose from 'mongoose';

const bpmnChangeLogSchema = new mongoose.Schema({
  bpmnDiagramId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BPMNDiagram',
    required: true
  },
  elementId: {
    type: String,
    required: true
  },
  elementName: {
    type: String,
    default: ''
  },
  elementType: {
    type: String,
    required: true
  },
  changeType: {
    type: String,
    enum: ['added', 'deleted', 'update', 'link', 'unlink'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('BPMNChangeLog', bpmnChangeLogSchema);
