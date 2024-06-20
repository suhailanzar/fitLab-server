import { IuserRepository } from "../interfaces/IuserRepository";
import { IuserInteractor } from "../interfaces/Iuserinteractor";
import { Response, Request, NextFunction } from "express";
import { User } from "../entities/user";
import { UserModel } from "../models/userModel";
import { trainerModel } from "../models/trainerModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, sendOtpEmail } from '../services/nodemailer'
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Otp } from '../models/userotp'

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
        username: payload.username,
        email: payload.email,
        password: payload.password,
        isblocked: payload.isblocked,
      };
      const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string, {
        expiresIn: "2h",
      });
      console.log('toke is ', token);

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
        existingUserDocument.isblocked
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
}
