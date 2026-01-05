import mongoose from 'mongoose';

const bpmnElementSchema = new mongoose.Schema({
  diagramId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BPMNDiagram',
    required: true
  },
  elementId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['task', 'gateway', 'event', 'subprocess'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  linkedIssueIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }]
});

export default mongoose.model('BPMNElement', bpmnElementSchema);
