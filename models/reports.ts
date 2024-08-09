import mongoose, { Schema, model } from 'mongoose';

export interface reportDocument extends Document{
    userId:Schema.Types.ObjectId,
    username:string,
    trainername:string,
    date:Date,
    report:string,
    description:string,
    evidence:string,
    isReported:boolean
}

const reportSchema:Schema<reportDocument> = new Schema({
    userId:{type:Schema.Types.ObjectId,required:true},
    username:{type:String,required:true},
    trainername:{type:String,required:true},
    date:{type:Date,required:true},
    report:{type:String,required:true},
    description:{type:String,required:true},
    evidence:{type:String},
    isReported:{type:Boolean,default:false}
})

export const reportModel = mongoose.model<reportDocument>('Reports',reportSchema)