import mongoose from 'mongoose';

const bpmnElementStatusSchema = new mongoose.Schema({
  elementId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'blocked'],
    default: 'not_started'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('BPMNElementStatus', bpmnElementStatusSchema);
