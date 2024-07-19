import mongoose, { Schema, model } from 'mongoose';




  export interface PaymentDocument extends Document {
    transactionId: string;
    userId: Schema.Types.ObjectId;
    trainerId?: Schema.Types.ObjectId;
    slotId?: Schema.Types.ObjectId;
    courseId?: Schema.Types.ObjectId;
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentType: 'slotBooking' | 'coursePurchase';
    paymentDate: Date;
    createdAt: Date;
  }

  const paymentSchema: Schema<PaymentDocument> = new Schema({
    transactionId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: 'trainerModel', required: false },
    slotId: { type: Schema.Types.ObjectId, ref: 'Slot', required: false },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: false },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentType: { type: String, enum: ['slotBooking', 'coursePurchase'], required: true },
    paymentDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  export const paymentModel = mongoose.model<PaymentDocument>("payment",paymentSchema)
  

