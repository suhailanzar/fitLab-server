import mongoose, { Schema, Document } from 'mongoose';
import { Slot } from '../entities/Trainer';

export interface TrainerDocument extends Document {
    trainername: string;
    email: string;
    password: string;
    isblocked: boolean;
    isapproved: boolean;
    specification: string;
    phone: number;
    image: string;
    availibilty: boolean;
    availableslots: Slot[];
}

const slotSchema: Schema = new Schema({
    userid: {type: String,required:true},
    username: {type: String,required:true},
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type:Boolean,required:true}
});

const trainerSchema: Schema<TrainerDocument> = new Schema({
    trainername: { type: String },
    email: { type: String },
    password: { type: String },
    isblocked: { type: Boolean },
    isapproved: { type: Boolean },
    specification: { type: String },
    phone: { type: Number },
    image: { type: String },
    availibilty: { type: Boolean },
    availableslots: { type: [slotSchema], default: [] }
});

export const trainerModel = mongoose.model<TrainerDocument>('Trainer', trainerSchema);
