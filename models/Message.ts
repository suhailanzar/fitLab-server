import mongoose, { Document, Schema } from 'mongoose';

export interface MessageDocument extends Document {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model<MessageDocument>('Message', MessageSchema);