import { IadminRepository } from "../interfaces/IadminRepository";
import { trainerModel } from "../models/trainerModel";
import { UserModel } from "../models/userModel";
import dotenv from "dotenv";
import { Meal } from "../entities/admin";
import { Mealmodel } from "../models/meals";
import { reportModel } from "../models/reports";
import { Reports, User } from "../entities/user";
import mongoose from "mongoose";


dotenv.config()
const password = process.env.ADMINPASS
const emaill = process.env.ADMINEMAIL


export class adminRepository implements IadminRepository {



   adminLogin = async (email: string, pass: string): Promise<boolean> => {
      console.log('email and password is ', emaill, password);

      if (email !== email || pass !== password) {
         return false
      } else {
         return true
      }

   };

   get_requests = async (): Promise<any> => {
      try {
         const trainers = await trainerModel.find({})
         return trainers
      } catch (error) {
         console.error(error)

      }
   }

   getTrainers = async (): Promise<any> => {
      try {
         const trainers = await trainerModel.find({ isapproved: true })

         return trainers
      } catch (error) {
         console.error(error)

      }
   }

   getUsers = async (): Promise<User[] | null> => {
      try {
         const users = await UserModel.find()
         return users
      } catch (error) {
         console.error(error)
         return null
      }
   }


   trainerapproval = async (trainerId: string): Promise<any> => {
      try {
         const trainerDetails = await trainerModel.findById(trainerId)
         console.log('traineris ', trainerDetails);

         if (!trainerDetails) {
            return false
         }
         trainerDetails.isapproved = true;
         return await trainerDetails.save()
      } catch (error) {
         console.error(error)

      }
   }

   blockTrainer = async (trainerId: string): Promise<string | null> => {
      try {
         const trainer = await trainerModel.findById(trainerId);

         if (!trainer) {
            throw new Error('Trainer not found');
         }

         trainer.isblocked = !trainer.isblocked;
         await trainer.save();
         return 'Success';
      } catch (error) {
         console.error(error);
         return null
      }
   };

   blockUser = async (userId: string): Promise<string | null> => {
      try {
         const user = await UserModel.findById(userId);

         if (!user) {
            throw new Error('user not found');
         }

         user.isblocked = !user.isblocked;
         await user.save();
         return 'Success';
      } catch (error) {
         console.error(error);
         return null
      }
   };


   trainerDetails = async (trainerId: string): Promise<any> => {
      try {

         console.log('trianer id in traienr details repo is is', trainerId);

         const trainerDetails = await trainerModel.findById(trainerId)

         if (!trainerDetails) {
            return false
         }
         return trainerDetails
      } catch (error) {
         console.error(error)

      }
   }


   userDetails = async (id: string): Promise<User | null> => {
      try {
        const userDetails = await UserModel.findById(id); 
    
        if (!userDetails) {
          return null; 
        }
    
        return userDetails;
      } catch (error) {
        console.error("Error fetching user details:", error);
        return null; 
      }
    }
    

   addmeal = async (meal: Meal): Promise<string | null> => {
      try {

         console.log("meal in repo is", meal)
         const newMeal = new Mealmodel({
            type: meal.type,
            name: meal.name,
            category: meal.category,
            image: meal.image,
            description: meal.description,
            calories: meal.calories,
            protein: meal.protein,
            fats: meal.fats,
            date: new Date()
         });

         const savedMeal = await newMeal.save()
         return savedMeal.name.toString();

      } catch (error) {
         console.error('Error adding new meal:', error);
         return null;
      };

   }

   getMeals = async (): Promise<any> => {
      try {
         const meals = await Mealmodel.find()

         return meals
      } catch (error) {
         console.error(error)

         return null

      }
   }


   getReports = async (): Promise<Reports[] | null> => {
      try {
         const Reports = await reportModel.find()

         const formattedReports: Reports[] = Reports.map(report => ({
            userId: report.userId,
            userName: report.username,
            trainerName: report.trainername,
            date: report.date,
            reportType: report.report,
            description: report.description,
            evidence: report.evidence,
            isReported: report.isReported,
            _id: report._id

         }))
         return formattedReports
      } catch (error) {
         console.error(error)
         return null

      }
   }
   findUser = async (id: string): Promise<User | null> => {
      try {
         // Start a session for transactions
         const session = await mongoose.startSession();
         session.startTransaction();

         try {
            // Find the user document
            const existingUserDocument = await UserModel.findOne({ _id: id }).session(session).exec();

            if (!existingUserDocument) {
               console.log('User not found');
               await session.abortTransaction();
               session.endSession();
               return null;
            }

            console.log('User found:', existingUserDocument);

            // Find and update the report document within the transaction
            const updateReport = await reportModel.findOneAndUpdate(
               { userId: id },
               { $set: { isReported: true } },
               {
                  new: true, // This option returns the updated document
                  session: session // Associate this operation with the transaction
               }
            );

            if (!updateReport) {
               console.log('Report not found or not updated');
               await session.abortTransaction();
               session.endSession();
               return existingUserDocument;
            }

            console.log('Report updated successfully:', updateReport);

            // Commit the transaction if everything went well
            await session.commitTransaction();
            session.endSession();

            return existingUserDocument;
         } catch (error) {
            console.error('Transaction aborted due to error:', error);
            await session.abortTransaction();
            throw error;
         }
      } catch (error) {
         console.error('Error starting session or transaction:', error);
         throw error;
      }
   };


}
