import { IuserRepository } from "../interfaces/IuserRepository";
import { Payment, User } from "../entities/user";
import { UserModel } from "../models/userModel";
import { trainerModel } from "../models/trainerModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, sendOtpEmail } from '../services/nodemailer'
import { Otp } from '../models/userotp'
import { paymentModel } from "../models/payment";
import { startSession } from 'mongoose';
import { Message } from "../models/Message";


export class userRepository implements IuserRepository {
  // private _jwtotp: String | null = null;


  userLogin = async (email: string): Promise<string> => {

    return email
  }

  RegisterUser = async (datas: User): Promise<User | null> => {
    try {
      const newUser = new UserModel(datas);
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      return null;
    }
  }


  otpchecked = async (value: number, email: string): Promise<{ isValid: boolean, isExpired: boolean }> => {
    try {
      console.log('Entered the repository of otpCheck', value);

      const storedotp = await Otp.findOne({ email: email })
      console.log('stored otp is , ', storedotp);

      if (storedotp) {
        return { isValid: storedotp.otp.toString() === value.toString(), isExpired: false }

      } else {
        return { isValid: false, isExpired: true }

      }
    } catch (err) {
      console.error(err);
      return { isValid: false, isExpired: true };

    }
  }



  //   //nodemailer and genrate otp
  sendmail = async (email: string): Promise<string> => {
    try {

      const existingOtp = await Otp.findOne({ email });

      if (existingOtp) {
        console.log('An OTP already exists for this email.');
        return email;
      }
      const OTP = generateOTP(4)

      const otpRecord = await Otp.findOne({ email });
      console.log("otp record is ", otpRecord, 'otp issss', OTP)
      try {
        if (otpRecord) {
          console.log('entered otprecoed');

          otpRecord.otp = OTP;
          await otpRecord.save();
        } else {
          console.log('entered else otprecored');

          const newOtpRecord = new Otp({ otp: OTP, email: email });
          await newOtpRecord.save();
        }
      } catch (error) {
        console.error('Failed to save OTP:', error);
      }

      const otp = await sendOtpEmail(email, OTP);
      console.log('email sent successfully');

      return email
    }


    catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  //   //To sign user data using jwt
  jwt = async (payload: User) => {
    try {
      const plainPayload = {
        id:payload.id,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        isblocked: payload.isblocked,
      };
      console.log('jwt token pauyload is',plainPayload);
      
      const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string, {
        expiresIn: "2h",
      });

      return token;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };


  refreshToken = async (payload: User) => {
    try {
      console.log("here the jwt ", payload);
      const plainPayload = {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        isblocked: payload.isblocked,
      };
      console.log("payload is", plainPayload);
      const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string, {
        expiresIn: "10d",
      });
      return token;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  //   //check if the pasword matching
  passwordmatch = async (email: string, password: string) => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log('is password matching ', isPasswordMatch);

        return isPasswordMatch;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };


  //check if the user is  existing or not
  findUser = async (email: string): Promise<User | null> => {
    try {
      const existingUserDocument = await UserModel.findOne({ email: email });
      console.log("exisitng user is", existingUserDocument);
      if (!existingUserDocument) {
        return null;
      }
      const user = new User(
        existingUserDocument.username,
        existingUserDocument.email,
        existingUserDocument.password,
        existingUserDocument.isblocked,
        existingUserDocument.id

      );
      console.log("usr from the findbyone in repo", user);
      return user;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  getTrainers = async (): Promise<Array<any>> => {
    try {
      const trainers = await trainerModel.aggregate([
        { $sort: { _id: -1 } },
        { $match: { isapproved: true } }
      ]);
      return trainers

    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  searchTrainer = async (query: string | RegExp): Promise<Array<string>> => {
    try {
      const trainers = await trainerModel.find({ trainername: new RegExp(query, 'i') });
      return trainers.map(trainer => trainer.trainername);

    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }


  savepayment = async (paymentdetails:Payment): Promise<Array<string>> => {

    const session = await startSession();
    session.startTransaction();
    try {
      console.log('payment details from frontis ',paymentdetails);
      
      const user = await UserModel.findOne({email:paymentdetails.email});  
      if (!user) {
        return ['User not found'];
      }
          

      const trainer = await trainerModel.findOneAndUpdate(
        { _id: paymentdetails.trainerid, 'availableslots._id': paymentdetails.slotid },
        {
          $set: {
            'availableslots.$.userid': user._id,
            'availableslots.$.status': true
          }
        },
        { new: true } // Return the updated document
      );

      const newPayment = new paymentModel({
        transactionId: paymentdetails.razorpayPaymentId,
        userId: user._id,
        trainerId: paymentdetails.trainerid,
        slotId: paymentdetails.slotid,
        amount: paymentdetails.amount / 100,
        currency: paymentdetails.currency,
        paymentDate: new Date(),
      });
      

      console.log('trainer details for payment is ',trainer);
      console.log('new updated payment is',newPayment);
      await newPayment.save({ session });

      await session.commitTransaction();
      console.log('Payment and slot update successful');


      return ["hshsh","hshsh"];

    } catch (error) {
      console.log("error", error);
      throw error;
    } finally {
      session.endSession();
    }
  }



  getMessages = async (data: any): Promise<Array<any> | string> => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: data.userid, receiverId: data.trainerid },
          { senderId: data.trainerid, receiverId: data.userid }
        ]
      }).sort({ timestamp: 1 });
  
      if (messages.length > 0) {
        return messages;
      } else {
        console.log("No messages found");
        return "no messages";
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
  
}
