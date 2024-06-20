import mongoose ,{Schema,Document} from 'mongoose'

export interface OtpDocument extends Document{
    otp: string;
    email: string;
    createdAt: object;
}   

const otpSchema = new Schema({
 otp: {type:String,required:true},
 email: {type:String,required:true},
 createdAt: { type: Date, expires: '1m', default: Date.now }
});

export const Otp = mongoose.model<OtpDocument>('Otp', otpSchema);