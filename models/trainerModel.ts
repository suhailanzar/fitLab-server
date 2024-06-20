import mongoose ,{Schema,Document} from 'mongoose'

export interface trainerDocument extends Document{
    trainername:string
    email:string
    password:string
    isblocked:boolean
    isapproved:boolean
    specification:string
    phone:number
    image:string
    availibilty:boolean
    availableslots:string[]
}

const trainerSchema:Schema<trainerDocument>=new Schema({
    trainername:{type:String},
    email:{type:String},
    password:{type:String},
    isblocked:{type:Boolean},
    isapproved:{type:Boolean},
    specification:{type:String},
    phone:{type:Number},
    image:{type:String},
    availibilty:{type:Boolean},
    availableslots: { type: [String] }
})

export const trainerModel=mongoose.model<trainerDocument>('trainer',trainerSchema)