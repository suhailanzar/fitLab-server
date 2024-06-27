import mongoose, { Schema, model } from 'mongoose';


export interface PaymentDocument extends Document {
    transactionId: string;
    userId: Schema.Types.ObjectId;
    trainerId?: Schema.Types.ObjectId;
    slotId?: Schema.Types.ObjectId;
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentDate: Date;
    createdAt: Date;

  }

const paymentSchema : Schema<PaymentDocument> = new Schema({
  transactionId: { type: String, required: true},
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trainerId: { type: Schema.Types.ObjectId, ref: 'Trainer', required: false },
  slotId: { type: Schema.Types.ObjectId, ref: 'Slot', required: false },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});


export const paymentModel = mongoose.model<PaymentDocument>("payment",paymentSchema)
