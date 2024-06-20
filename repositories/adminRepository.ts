import { IadminRepository } from "../interfaces/IadminRepository";
import { IadminInteractor } from "../interfaces/IadminInteractor";
import { trainerModel } from "../models/trainerModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Trainer } from "../entities/Trainer";

dotenv.config()
const password = process.env.ADMINPASS
const emaill = process.env.ADMINEMAIL


export class adminRepository implements IadminRepository {

    

    adminLogin = async (email: string, pass: string): Promise<boolean> => {
        console.log('email and password is ',emaill,password);

        if (email!== email || pass!== password) {
          return false
        }else{
            return true
        }
    
      };

      get_requests = async (): Promise<any> =>{
         try {
          const trainers = await trainerModel.find({})
          return trainers
         } catch (error) {
          console.error(error)
          
         }
      }

      getTrainers = async (): Promise<any> =>{
         try {
          const trainers = await trainerModel.find({isapproved:true})
          console.log('trainers were....',trainers);
          
          return trainers
         } catch (error) {
          console.error(error)
          
         }
      }
      
      trainerapproval = async (trainerId:string): Promise<any> =>{
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

      trainerDetails = async (trainerId:string): Promise<any> =>{
         try {
          const trainerDetails = await trainerModel.findById(trainerId)
          
          if (!trainerDetails) {
            return false
          }
         } catch (error) {
          console.error(error)
          
         }
      }



}
