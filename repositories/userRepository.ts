import { IuserRepository } from "../interfaces/IuserRepository";
import { coursePayment, enrolledCourse, Payment, Reports, User } from "../entities/user";
import { UserModel } from "../models/userModel";
import { trainerModel } from "../models/trainerModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, sendOtpEmail } from '../services/nodemailer'
import { Otp } from '../models/userotp'
import { PaymentDocument, paymentModel } from "../models/payment";
import mongoose, { ObjectId, startSession } from 'mongoose';
import { Message } from "../models/Message";
import { uploadS3Image } from "../utils/s3uploads";
import Course from "../models/courses";
import { ICourse, IModule } from "../entities/Trainer";
import { response } from "express";
import EnrolledCourse from "../models/purchasedCourses";
import { reportModel } from "../models/reports";




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
  jwt = async (payload: User) => {
    try {
      const plainPayload = {
        _id: payload.id,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        isblocked: payload.isblocked,
      };

      const token = jwt.sign(plainPayload, process.env.SECRET_LOGIN as string, {
        expiresIn: "24h",
      });

      return token;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };


  refreshToken = async (payload: User) => {
    try {
      const plainPayload = {
        username: payload.username,
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
      const user = await UserModel.findOne({ email });
      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

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
      if (!existingUserDocument) {
        console.log('no user found');

        return null;
      }

      console.log('find user is login', existingUserDocument);


      return existingUserDocument;
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


  bookslot = async (paymentdetails: Payment): Promise<Array<string>> => {

    const session = await startSession();

    session.startTransaction();


    try {

      const user = await UserModel.findOne({ _id: paymentdetails.userid });
      if (!user) {
        return ['User not found'];

      }

      const trainer = await trainerModel.findOneAndUpdate(
        { _id: paymentdetails.trainerid, 'availableslots._id': paymentdetails.slotid },
        {
          $set: {
            'availableslots.$.userid': user._id,
            'availableslots.$.username': user.username,
            'availableslots.$.status': true
          }
        },
        { new: true } // Return the updated document
      );

      console.log('updated trainer is ', trainer);


      const newPayment = new paymentModel({
        transactionId: paymentdetails.razorpayPaymentId,
        userId: user._id,
        trainerId: paymentdetails.trainerid,
        slotId: paymentdetails.slotid,
        amount: paymentdetails.amount / 100,
        currency: paymentdetails.currency,
        paymentMethod:"razorPay",
        paymentType:"slotBooking",
        paymentDate: new Date(),
      });


      await newPayment.save({ session });

      await session.commitTransaction();

      return ["payment successfull"];

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
        return [];
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }



  editprofile = async (data: User, id: string, s3Response: any): Promise<User | null> => {

    try {

      const existUser = await UserModel.findById(id);


      if (!existUser) {
        throw new Error('user not found');
      }

      const updatedData: any = {};

      if (data.username) updatedData.username = data.username;
      if (s3Response && s3Response.Location) updatedData.image = s3Response.Location;
      if (data.place) updatedData.place = data.place;
      if (data.age) updatedData.age = data.age;
      if (data.createdat) updatedData.createdat = data.createdat;
      if (data.weight) updatedData.weight = data.weight;
      if (data.height) updatedData.height = data.height;
      if (data.gender) updatedData.gender = data.gender;


      console.log('updated data is ', updatedData);

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: id },
        updatedData,
        { new: true, upsert: true }
      );

      console.log('upadated user is', updatedUser);

      if (!updatedUser) {
        throw new Error('Failed to update trainer profile');
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating trainer profile:", error);
      throw error;
    }
  }


  getuserprofile = async (id: string): Promise<User | null> => {
    try {
      const existingUserDocument = await UserModel.findOne({ _id: id });
      if (!existingUserDocument) {
        console.log('no user found');

        return null;
      }

      console.log('find user is login', existingUserDocument);

      return existingUserDocument;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };


  subscribe = async (paymentdetails: any, userid: string): Promise<Array<string>> => {

    const session = await startSession();

    session.startTransaction();


    try {      
  
      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 1); 
  
      // Update user's subscription
      const subscription: any = {
        name: paymentdetails.planname, 
        startDate,
        endDate,
        isActive: true
      };
  
      await UserModel.updateOne(
        { _id: userid },
        { $set: { subscription } },
        { session }
      );
  
      await session.commitTransaction();
      return ["Payment successful"];
  
    } catch (error) {
      console.log("error", error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  getCourse = async (page:number,limit:number): Promise<{ courses: any[], totalCourses: number }> => {
    const skip = (page - 1) * limit;

    try {
    
       const courses = await Course.find().skip(skip).limit(limit);
      const totalCourses = await Course.countDocuments();
      return { courses, totalCourses };
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching courses');
      }
 }

  getCoursedetails = async (id: string): Promise<ICourse | null> => {
  try {
    console.log('id in gecourse is',id);
    
    const course = await Course.findOne({ _id: id })

    if (!course) {
      return null;
    }

    console.log('course in repo is',course);
    

    const modules: IModule[] = course.modules.map((module: any) => ({
      name: module.moduleName,
      description: module.moduleDescription,
      videoUrl:module.videoUrl,
      id:module.id
    }));

    const courseDetails: ICourse = {
      author: course.author,
      courseName: course.courseName,
      description: course.description,
      thumbnail: course.thumbnail,
      modules: modules,
      Price: course.Price,
      trainerId: course.trainerId,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      id: id
    };

    return courseDetails;
  } catch (error) {
    console.error(error);
    return null;
  }
};


saveCourse = async (paymentDetails: coursePayment, userId: string): Promise<string | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    console.log('payment detial ins te save course are',paymentDetails);
    
    // Create an instance of the Payment model
    const paymentData = new paymentModel({
      transactionId: paymentDetails.razorpayPaymentId,
      userId: userId,
      trainerId:paymentDetails.trainerId, 
      courseId:paymentDetails.courseId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      paymentMethod: 'razorpay',
      paymentType: 'coursePurchase',
      paymentDate: new Date(),
      createdAt: new Date(),
    });

    // Save the payment data
    await paymentData.save({ session });

    // Update the user's document to add the purchased course
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { courses: new mongoose.Types.ObjectId(paymentDetails.courseId) } },
      { new: true, session }
    );

    const course = await Course.findById(paymentDetails.courseId);
        if (!course) {
            throw new Error('Course not found');
        }


    const enrolledModules = course.modules.map((module) => ({
      moduleId: module._id,
      completed: false,
  }));

  // Create and save the enrolled course
  const enrolledCourse = new EnrolledCourse({
      userId,
      courseId: paymentDetails.courseId,
      enrolledAt: new Date(),
      completed: false,
      modules: enrolledModules,
  });

  await enrolledCourse.save();



    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return 'Course purchase successful';
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return null;
  }
};


getPurchasedCourses = async (userId: string): Promise<{ Enrolled: any, courses: any }> => {
  try {
    const enrolledCourses = await EnrolledCourse.find({ userId });

    // Collect courseIds from enrolled courses
    const courseIds = enrolledCourses.map(enrolledCourse => enrolledCourse.courseId);

    // Find all courses corresponding to the collected courseIds
    const courses = await Course.find({ _id: { $in: courseIds } });

    return { Enrolled: enrolledCourses, courses };

  } catch (error) {
    console.error('Error in getPurchasedCourses:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

updateModuleCompletion = async (moduleId: string, courseId: string, completed: boolean): Promise<string> => {
  try {
    const course = await EnrolledCourse.findOne({ courseId });

    if (!course) {
      throw new Error('Course not found');
    }

    const moduleIndex = course.modules.findIndex(m => m.moduleId.toString() === moduleId);
    if (moduleIndex === -1) {
      throw new Error('Module not found');
    }

    course.modules[moduleIndex].completed = completed;
    await course.save();

    return 'Module completion status updated successfully';
  } catch (error) {
    console.error('Error in updateModuleCompletion:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

submitReport = async (data:Reports):Promise<string | null> => {

  try {

    const userData = await UserModel.findOne({_id:data.userId})

    const report = new reportModel({
      userId :data.userId,
      username:userData?.username,
      trainername:data.trainerName,
      date:data.date,
      report:data.reportType,
      description:data.description,
      evidence:data.evidence
    });

    console.log('report in repo is',report);
    

    const savedReport = await report.save();

    if (savedReport) {
      console.log('Report successfully saved:', savedReport);
      return 'success';
    } else {
      console.error('Failed to save the report');
      return null;
    }
      
  } catch (error) {
    console.error(error)
    throw new Error("not updated ")
  }

}

}
