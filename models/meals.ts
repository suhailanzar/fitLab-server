import mongoose, { Document, Schema } from 'mongoose';

export interface MealDocument extends Document {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  category: 'Veg' | 'Non-veg';
  name: string;
  image:string;
  description?: string;
  calories: number;
  protein: number;
  fats:number;
  date: Date;
}

const mealSchema = new Schema<MealDocument>({
  type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  category: { type: String, enum: ['Veg', 'Non-veg'], required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  fats: { type: Number, required: true },
  date: { type: Date, required: true },
});

export const Mealmodel = mongoose.model<MealDocument>('Meal', mealSchema);
