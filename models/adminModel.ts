import mongoose ,{Schema,Document} from 'mongoose'

export interface adminDocument extends Document{
    email:string
    password:string
}

const adminSchema:Schema<adminDocument>=new Schema({
    email:{type:String},
    password:{type:String},
})

export const adminModel=mongoose.model<adminDocument>('admin',adminSchema)