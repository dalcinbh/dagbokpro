import mongoose, { Schema, Document } from 'mongoose';

export interface ITranscription extends Document {
  text: string;
  userId: string;
  status: 'pending' | 'processed' | 'error';
  generatedPostId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TranscriptionSchema = new Schema<ITranscription>({
  text: { type: String, required: true },
  userId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processed', 'error'],
    default: 'pending'
  },
  generatedPostId: { type: String },
}, {
  timestamps: true,
});

export const Transcription = mongoose.models.Transcription || 
  mongoose.model<ITranscription>('Transcription', TranscriptionSchema); 