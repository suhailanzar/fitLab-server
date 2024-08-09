import mongoose, { Document, Schema } from 'mongoose';

export interface MessageDocument extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  roomId:string;
  timestamp: Date;
  isRead: { type: Boolean, default: false }

}

const MessageSchema: Schema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  roomId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }

});

export const Message = mongoose.model<MessageDocument>('Message', MessageSchema);