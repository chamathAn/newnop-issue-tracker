const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: [true, 'Priority is required'],
    },
    severity: {
      type: String,
      enum: ['minor', 'major', 'critical', 'blocker'],
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

issueSchema.index({ status: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Issue', issueSchema);
