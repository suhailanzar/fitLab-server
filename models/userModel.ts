import mongoose ,{Schema,Document} from 'mongoose'

export interface UserDocument extends Document{
    username:string
    email:string
    password:string
    isblocked:boolean
    place:string
    age:number,
    gender:string
    weight:number
    height:number
    image:string
    createdat:Date
    subscription:Subscription
    courses: string[];
    savedMeals: { mealName: string; meals: Meal[] }[]; 
  }

  export interface Meal {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    category: 'Veg' | 'Non-veg';
    name: string;
    image: string;
    description: string;  
    calories: number;
    protein: number;
    fats: number;
    date: Date;
}

  const mealSchema = new Schema<Meal>({
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

  const savedMealSchema = new Schema({
    mealName: { type: String, required: true },
    meals: [mealSchema], 
  });

  

interface Subscription {
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }

  const subscriptionSchema = new Schema<Subscription>({
    name: { type: String,  required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
  });


const UserSchema: Schema<UserDocument> = new Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    isblocked: { type: Boolean },
    place: { type: String }, 
    age: { type: Number }, 
    gender: { type: String }, 
    weight: { type: Number }, 
    height: { type: Number }, 
    image: { type: String }, 
    createdat: { type: Date }, 
    subscription: subscriptionSchema,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    savedMeals: [savedMealSchema],  

});



export const UserModel=mongoose.model<UserDocument>('user',UserSchema)