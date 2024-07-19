import { ItrainerRepository } from "../interfaces/ItrainerRepository";
import { ICourse, IPayment, Slot, Trainer } from "../entities/Trainer";
import { trainerModel } from "../models/trainerModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, sendOtpEmail } from '../services/nodemailer'
import { Otp } from '../models/userotp'
import { uploadS3Image } from "../utils/s3uploads";
import { User } from "../entities/user";
import { UserModel } from "../models/userModel";
import Course from "../models/courses";
import mongoose, { ObjectId, Types } from "mongoose";
import { paymentModel } from "../models/payment";


export class trainerRepository implements ItrainerRepository {
  // private _jwtotp: String | null = null;


  trainerLogin = async (email: string): Promise<string> => {

    return email
  }



  Registertrainer = async (datas: Trainer): Promise<Trainer | null> => {
    try {

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

          otpRecord.otp = OTP;
          await otpRecord.save();
        } else {

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
      const plainPayload = {
        username: payload.trainername,
        email: payload.email,
        password: payload.password,
        isblocked: payload.isblocked,
      };
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

      // console.log('upadated trainer is', updatedTrainer);

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



  addslot = async (id: string, slot: Slot): Promise<Slot | null> => {
    try {
      const existingUser = await trainerModel.findOne({ _id: id });

      if (!existingUser) {
        return null;
      }


      const slotToAdd: Slot = {
        userid: null,
        username: null,
        date: slot.date,
        startTime: slot.startTime,
        price: slot.price,
        status: false,
        id: ""
      };

      // Add the new slot to the existing available slots
      existingUser.availableslots.push(slotToAdd);

      // Update the trainer document in the database
      await trainerModel.updateOne({ _id: id }, { availableslots: existingUser.availableslots });

      return slotToAdd


    } catch (error) {
      console.error("Error adding slot to trainer profile:", error);
      throw error;
    }
  };


  getslots = async (id: string): Promise<Trainer | null> => {
    try {
      const existingUser = await trainerModel.findOne({ _id: id });

      if (!existingUser) {
        return null;
      }

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


  getclients = async (): Promise<Array<User> | null> => {

    try {
      const users = await UserModel.find({})
      if (!users) {
        return null
      }
      return users

    } catch (error) {
      console.error('fetching users failed', error);
      return null;
    }

  }

  getbookings = async (trainerid: string): Promise<Array<Slot> | string> => {
    try {

      console.log('trainr id is ', trainerid);


      const trainer = await trainerModel.findById(trainerid).lean();
      console.log("trainer si repo soifhfsj", trainer);


      const bookedSlots = await trainerModel.aggregate([
        {
          $match: {
            _id: trainerid
          }
        },
        {
          $unwind: "$availableslots"
        },
        {
          $match: {
            "availableslots.status": true
          }
        },
        {
          $group: {
            _id: "$_id",
            slots: { $push: "$availableslots" }
          }
        }
      ]);

      console.log('booking slots in repos is', bookedSlots);


      if (!bookedSlots || bookedSlots.length === 0) {
        return "null";
      }

      return bookedSlots;
    } catch (error) {
      console.error('Fetching bookings failed', error);
      return 'entered catch block';
    }
  };

  editSlot = async (trainerid: string, slotid: string, slotData: Slot): Promise<Slot | null> => {
    try {


      const trainer = await trainerModel.findById(trainerid);
      console.log('trainer is ', trainer);


      if (!trainer) return null;

      const updateResult = await trainerModel.updateOne(
        { _id: trainerid, 'availableslots._id': slotid },
        {
          $set: {
            'availableslots.$.date': slotData.date,
            'availableslots.$.startTime': slotData.startTime,
            'availableslots.$.price': slotData.price
          }
        }
      );


      console.log('updated result is ', updateResult);


      if (!updateResult) {
        return null;
      }

      const updatedTrainer = await trainerModel.findById(trainerid);
      if (!updatedTrainer) return null;

      const updatedSlot = updatedTrainer.availableslots.find(slot => slot.id.toString() === slotid);

      if (!updatedSlot) return null;

      const result: Slot = {
        date: updatedSlot.date,
        startTime: updatedSlot.startTime,
        price: updatedSlot.price,
        userid: null,
        username: null,
        status: false,
        id: slotid
      };

      return result;

    } catch (error) {
      console.error('Updating slot failed', error);
      return null;
    }
  };




  addCourse = async (CourseDetails: ICourse): Promise<string | null> => {

    try {

      console.log("course details are ", CourseDetails)
      const newCourse = new Course(CourseDetails);
      console.log('new course is', newCourse);

      const savedCourse = await newCourse.save();

      if (savedCourse) {
        return "success"
      } else {
        return null
      }

    } catch (error) {
      console.error('fetching users failed', error);
      return null;
    }

  }

  getCourses = async (trainerId: ObjectId): Promise<Array<ICourse> | null> => {
    try {
      const availableCourses = await Course.find({ trainerId }).lean().exec();

      if (!availableCourses || availableCourses.length === 0) {
        return [];
      }

      console.log('available courses are', availableCourses);

      const courses = availableCourses.map((course: any) => ({
        author: course.author,
        courseName: course.courseName,
        description: course.description,
        modules: course.modules.map((module: any) => ({
          name: module.moduleName,
          description: module.moduleDescription,
          videoUrl: module.videoUrl,
        })),
        Price: course.Price,
        trainerId: course.trainerId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        id: course._id.toString(), // Convert ObjectId to string
      }));

      return courses;
    } catch (error) {
      console.error('fetching courses failed', error);
      return [];
    }
  };

  revenueData = async (trainerId: string): Promise<Array<IPayment> | null> => {
    try {

      console.log('trainer id is', trainerId);
    
      let objectId: Types.ObjectId;
      try {
        objectId = new Types.ObjectId(trainerId);
      } catch (e) {
        console.error('Invalid trainerId format:', trainerId);
        return null;
      }

      console.log('object id is',objectId);
      
  
      const revenueData = await paymentModel.find({ trainerId: objectId });
  
      console.log('revenue data', revenueData);


      const paymentRevenue: IPayment[] = revenueData.map((payment: IPayment) => ({
        transactionId: payment.transactionId,
        userId: payment.userId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        paymentType: payment.paymentType,
        paymentDate: payment.paymentDate,
        createdAt: payment.createdAt,
        trainerId: payment.trainerId,
        slotId: payment.slotId,
        courseId: payment.courseId,
        id: payment.id,
      }));


      return paymentRevenue;


    } catch (error) {
      console.error('Fetching Revenue failed', error);
      return null; // Return null to indicate failure to fetch data
    }
  };
}
