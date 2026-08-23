import mongoose, { Schema } from 'mongoose';

const groundingStepResponseSchema = new Schema(
  {
    stepId: Number,
    prompt: String,
    response: String,
    senseType: String,
  },
  { _id: false },
);

const groundingSessionSchema = new Schema(
  {
    clientId: {
      type: String,
      index: true,
    },
    techniqueId: {
      type: String,
      required: true,
      index: true,
    },
    techniqueName: String,
    techniqueCategory: {
      type: String,
      enum: ['sensorik', 'afirmasi', 'pernapasan', 'gerakan'],
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
      index: true,
    },
    completedAt: Date,
    durationSeconds: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    anxietyPre: Number,
    anxietyPost: Number,
    stepResponses: [groundingStepResponseSchema],
  },
  {
    timestamps: true,
    collection: 'grounding_sessions',
  },
);

const GroundingSession =
  mongoose.models.GroundingSession || mongoose.model('GroundingSession', groundingSessionSchema);

export default GroundingSession;