import { ItrainerRepository } from "../interfaces/ItrainerRepository";
import { IuserInteractor } from "../interfaces/Iuserinteractor";
import { Response, Request, NextFunction } from "express";
import { Trainer } from "../entities/Trainer";
import { trainerModel } from "../models/trainerModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, sendOtpEmail } from '../services/nodemailer'
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Otp } from '../models/userotp'
import { uploadS3Image } from "../utils/s3uploads";

export class trainerRepository implements ItrainerRepository {
  // private _jwtotp: String | null = null;


  trainerLogin = async (email: string): Promise<string> => {

    return email
  }



  Registertrainer = async (datas: Trainer): Promise<Trainer | null> => {
    try {
      console.log('treinaer detailas arere wer', datas);

      const newUser = new trainerModel(datas);
      const updated = await newUser.save();
      const trainer = new Trainer(updated.trainername, updated.email, updated.password, updated.isblocked, updated.isapproved);
      return trainer;
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

  jwt = async (payload: Trainer) => {
    try {
      const plainPayload = {
        _id: payload._id,
        username: payload.trainername,
        email: payload.email,
        password: payload.password,
        isblocked: payload.isblocked,
      };

      console.log('planpayload is ', plainPayload);

      const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string, {
        expiresIn: "2h",
      });

      return token;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };


  refreshToken = async (payload: Trainer) => {
    try {
      console.log("here the jwt ", payload);
      const plainPayload = {
        username: payload.trainername,
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
      const user = await trainerModel.findOne({ email });
      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        return isPasswordMatch;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  editProfileTrainer = async (data: Trainer, id: string, image: Express.Multer.File): Promise<string> => {
    try {

      const existTrainer = await trainerModel.findById(id);
      const s3Response: any = await uploadS3Image(image)

      if (!s3Response.error) {
        console.log('url of the image from the s3buket', s3Response.Location);
      } else {
        console.log('error in uploading image to cloud');

      }

      if (!existTrainer) {
        throw new Error('Trainer not found');
      }

      // Prepare the update object
      const updatedData = {
        trainername: data.trainername,
        image: s3Response.Location,
        specification: data.specification,
        phone: data.phone,
      };

      const updatedTrainer = await trainerModel.findOneAndUpdate(
        { _id: id },
        updatedData,
        { new: true, upsert: true }
      );

       console.log('upadated trainer is', updatedTrainer);
       
      if (!updatedTrainer) {
        throw new Error('Failed to update trainer profile');
      }

      return "success";
    } catch (error) {
      console.error("Error updating trainer profile:", error);
      throw error;
    }
  };





  findtrainer = async (email: string): Promise<Trainer | null> => {
    try {
      const existingUserDocument = await trainerModel.findOne({ email: email });
      console.log("exisitng user is", existingUserDocument);
      if (!existingUserDocument) {
        return null;
      }
      const user = new Trainer(
        existingUserDocument.trainername,
        existingUserDocument.email,
        existingUserDocument.password,
        existingUserDocument.isblocked,
        existingUserDocument.isapproved,
        existingUserDocument.availibilty,
        existingUserDocument.availableslots,
        existingUserDocument.image,
        existingUserDocument.phone,
        existingUserDocument.specification,
        existingUserDocument.id,

      );
      return user;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };


  getprofile = async (id: string): Promise<Trainer | null> => {
    try {
      const existingUser = await trainerModel.findOne({ _id: id });

      if (!existingUser) {
        return null;
      }

      console.log('existing user in getprofile is ', existingUser);

      const trainer = new Trainer(
        existingUser.trainername,
        existingUser.email,
        existingUser.password,
        existingUser.isblocked,
        existingUser.isapproved,
        existingUser.availibilty,
        existingUser.availableslots,
        existingUser.image,
        existingUser.phone,
        existingUser.specification,
        existingUser.id,

      );

      return trainer;

    } catch (error) {
      console.error("Error fetching trainer profile:", error);
      throw error;
    }
  };



}
