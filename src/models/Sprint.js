import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  issueIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  }],
  status: {
    type: String,
    enum: ['PLANNING', 'ACTIVE', 'COMPLETED'],
    default: 'PLANNING'
  }
}, {
  timestamps: true
});

export default mongoose.model('Sprint', sprintSchema);
