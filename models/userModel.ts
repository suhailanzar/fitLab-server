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
}



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

});



export const UserModel=mongoose.model<UserDocument>('user',UserSchema)