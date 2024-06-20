import mongoose ,{Schema,Document} from 'mongoose'

export interface UserDocument extends Document{
    username:string
    email:string
    password:string
    isblocked:boolean
}

const UserSchema:Schema<UserDocument>=new Schema({
    username:{type:String},
    email:{type:String},
    password:{type:String},
    isblocked:{type:Boolean}
})

export const UserModel=mongoose.model<UserDocument>('user',UserSchema)