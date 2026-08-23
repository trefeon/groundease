import mongoose, { Schema } from 'mongoose';

const FEEDBACK_CATEGORIES = [
  'kegunaan',
  'tampilan',
  'teknik',
  'saran',
  'bug',
  'lainnya',
] as const;

const feedbackSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      enum: FEEDBACK_CATEGORIES,
      required: true,
    },
    message: {
      type: String,
      maxlength: 2000,
      default: '',
    },
    sourcePage: {
      type: String,
      default: 'unknown',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'feedback',
  },
);

const Feedback =
  mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
export { FEEDBACK_CATEGORIES };
