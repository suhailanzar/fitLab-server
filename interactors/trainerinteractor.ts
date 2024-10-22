 import { ObjectId } from "mongoose";
import { ICourse, IPayment, Trainer } from "../entities/Trainer";
import { Slot } from "../entities/Trainer";
import { User } from "../entities/user";
import { ItrainerInteractor } from "../interfaces/Itrainerinteractor";
import { ItrainerRepository } from "../interfaces/ItrainerRepository";
import dotenv from "dotenv";

dotenv.config();

export class trainerInteractor implements ItrainerInteractor {
  
  private trainerrepository: ItrainerRepository;

  constructor(trainerRepository: ItrainerRepository) {
    this.trainerrepository = trainerRepository;
  }


  trainerLogin = (email: string): Promise<string> => {
    return this.trainerrepository.trainerLogin(email)


  };


  Registertrainer = async (datas: Trainer): Promise<Trainer | null> => {
    return await this.trainerrepository.Registertrainer(datas)
  }



  findtrainer = async (email: string): Promise<Trainer | null> => {
    try {
      return await this.trainerrepository.findtrainer(email);
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };

  checkpass = async (email: string, password: string) => {
    try {
      return await this.trainerrepository.passwordmatch(email, password);
    } catch (error) {
      console.error("Error in checkpass:", error);
      throw error;
    }
  };

  otpcheck = async (otp: number, email: string): Promise<{ isValid: boolean, isExpired: boolean }> => {

    console.log('entered otpcheck interactor', otp);
    return await this.trainerrepository.otpchecked(otp, email)

  };

  jwt = async (payload: Trainer): Promise<string> => {
    try {
      return await this.trainerrepository.jwt(payload);
    } catch (error) {
      console.error("Error in jwt:", error);
      throw error;
    }
  };

  refreshToken = async (payload: Trainer) => {
    try {
      return await this.trainerrepository.refreshToken(payload);
    } catch (error) {
      console.error("Error in jwt:", error);
      throw error;
    }
  }


  sendmail = async (email: string): Promise<string> => {
    try {
      return await this.trainerrepository.sendmail(email);
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };

  editProfileTrainer = async (data:Trainer,id:string,image:Express.Multer.File): Promise<string> => {
    try {
      
      return await this.trainerrepository.editProfileTrainer(data,id,image);
    } catch (error) {
      console.error("Error in editprofile:", error);
      throw error;
    }
  };


  getprofile = async (id:string): Promise<Trainer | null> => {
    try {
      
      return await this.trainerrepository.getprofile(id);
    } catch (error) {
      console.error("Error in fetching profile:", error);
      throw error;
    }
  };


  addSlots = async (id: string, slots: Slot[]): Promise<Slot[] | string> => {
    try {
      
      return await this.trainerrepository.addSlots(id,slots);
    } catch (error) {
      console.error("Error in adding slot:", error);
      throw error;
    }
  };

  getslots = async (id:string): Promise<Trainer | null> => {
    try {
      
      return await this.trainerrepository.getslots(id);
    } catch (error) {
      console.error("Error in fetching profile:", error);
      throw error;
    }
  };


  getclients = async (): Promise<Array<User> | null> => {
    try {
      
      return await this.trainerrepository.getclients();
    } catch (error) {
      console.error("Error in fetching profile:", error);
      throw error;
    }
  }; 

  getbookings = async (trainerid:string): Promise<Array<Slot> | string> => {
    try {
      
      return await this.trainerrepository.getbookings(trainerid);
    } catch (error) {
      console.error("Error in fetching profile:", error);
      throw error;
    }
  };

  editSlot = async (trainerid:string,slotid:string,data:Slot): Promise<Slot | null> => {
    try {
      return await this.trainerrepository.editSlot(trainerid,slotid,data);
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };

  addCourse = async (CourseDetails:ICourse): Promise<string | null> => {
    try {
      return await this.trainerrepository.addCourse(CourseDetails);
    } catch (error) {
      console.error("Error in updainng document:", error);
      throw error;
    }
  };

  getMessagesTrainer = async (data: any): Promise<Array<any> | string> => {
    try {
      const messages = await this.trainerrepository.getMessagesTrainer(data);
  
      if (messages.length > 0) {
        return messages;
      } else {
        console.log("No messages found");
        return ["No messages found"];
      }
    } catch (error) {
      console.error("Error in getMessages:", error);
      throw error;
    }
  };
  
  getCourses = async (trainerid:ObjectId ): Promise<Array<ICourse> | null> => {
    try {
      
      return await this.trainerrepository.getCourses(trainerid);
    } catch (error) {
      console.error("Error in fetching profile:", error);
      throw error;
    }
  };

  revenueData = async (trainerId: string): Promise<Array<IPayment> | null> => {
    try {
      
      return await this.trainerrepository.revenueData(trainerId);
    } catch (error) {
      console.error("Error fetching Revenue data:", error);
      throw error;
    }
  };

  deleteSlot = async(trainerId:string,slotId:string):Promise<string | null> => {
    try {
      
      return await this.trainerrepository.deleteSlot(trainerId,slotId);
    } catch (error) {
      console.error("Error fetching Revenue data:", error);
      throw error;
    }
  }



}
