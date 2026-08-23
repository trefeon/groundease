import mongoose, { Schema } from 'mongoose';

const anxietyAssessmentSchema = new Schema(
  {
    clientId: {
      type: String,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    scaleType: {
      type: String,
      enum: ['SUD', 'GAD-2'],
      default: 'SUD',
    },
    context: {
      type: String,
      enum: ['pre', 'post', 'standalone'],
      required: true,
    },
    sessionId: String,
  },
  {
    timestamps: true,
    collection: 'anxiety_assessments',
  },
);

const AnxietyAssessment =
  mongoose.models.AnxietyAssessment || mongoose.model('AnxietyAssessment', anxietyAssessmentSchema);

export default AnxietyAssessment;

