import { coursePayment, Payment, Reports, User } from "../entities/user";
import { IuserInteractor } from "../interfaces/Iuserinteractor";
import { IuserRepository } from "../interfaces/IuserRepository";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";
import { ICourse } from "../entities/Trainer";
import { Meal } from "../entities/admin";

dotenv.config();

export class userInteractor implements IuserInteractor {
  private userRepository: IuserRepository;

  constructor(Userrepository: IuserRepository) {
    this.userRepository = Userrepository;
  }


  userLogin = (email: string): Promise<string> => {
    return this.userRepository.userLogin(email)


  };


  RegisterUser = async (datas: User): Promise<User | null> => {
    return await this.userRepository.RegisterUser(datas)
  }


  signup = async (
    username: string,
    email: string,
    password: string,
    isblocked: boolean
  ): Promise<User | null> => {
    try {

      const details = {
        username: username,
        email: email,
        password: password,
        isblocked: isblocked
      }

      return await this.userRepository.RegisterUser(details);

    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };


  findUser = async (email: string): Promise<User | null> => {
    try {
      return await this.userRepository.findUser(email);
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };

  checkpass = async (email: string, password: string) => {
    try {
      return await this.userRepository.passwordmatch(email, password);
    } catch (error) {
      console.error("Error in checkpass:", error);
      throw error;
    }
  };

  otpcheck = async (otp: number, email: string): Promise<{ isValid: boolean, isExpired: boolean }> => {

    return await this.userRepository.otpchecked(otp, email)

  };

  jwt = async (payload: User): Promise<string> => {
    try {
      return await this.userRepository.jwt(payload);
    } catch (error) {
      console.error("Error in jwt:", error);
      throw error;
    }
  };

  refreshToken = async (payload: User) => {
    try {
      return await this.userRepository.refreshToken(payload);
    } catch (error) {
      console.error("Error in jwt:", error);
      throw error;
    }
  }


  sendmail = async (email: string): Promise<string> => {
    try {
      return await this.userRepository.sendmail(email);
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };

  

  getTrainer = async (): Promise<Array<any>> => {
    try {
      return await this.userRepository.getTrainers();
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };

  searchTrainer = async (query: string | RegExp): Promise<Array<any>> => {
    try {
      return await this.userRepository.searchTrainer(query);
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };

  bookslot = async (paymentdetails:Payment): Promise<Array<any>> => {
    try {
      return await this.userRepository.bookslot(paymentdetails);
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };


  
  getMessages = async (data: any): Promise<Array<any> | string> => {
    try {
      const messages = await this.userRepository.getMessages(data);
  
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

  editprofile = async (data: User, id: string, image: any): Promise<User | null> => {
    try {
      const userdata = await this.userRepository.editprofile(data ,id, image);
      if(userdata){
        return userdata
      }
      return null
     
    } catch (error) {
      console.error("Error in getMessages:", error);
      throw error;
    }
  };

  
  getuserprofile = async (id:string): Promise<User | null> => {
    try {
      return await this.userRepository.getuserprofile(id);
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };

  subscribe = async (paymentdetails:Payment, userid:string): Promise<Array<any>> => {
    try {
      return await this.userRepository.subscribe(paymentdetails,userid);
    } catch (error) {
      console.error("Error in sendmail:", error);
      throw error;
    }
  };

  getCourse =(page:number,limit:number):Promise<any> =>{
    try {
      return this.userRepository.getCourse(page,limit)
     } catch (error) {
      console.error("Error in getcourse:", error);
      throw error;
    }
  }

  getPurchasedCourses =(userId:string):Promise<{Enrolled:any,courses:any}> =>{
    try {
      return this.userRepository.getPurchasedCourses(userId)
     } catch (error) {
      console.error("Error in purchaesed course:", error);
      throw error;
    }
  }


  getCoursedetails =(id:string):Promise<ICourse | null> =>{
    try {
      return this.userRepository.getCoursedetails(id)
     } catch (error) {
      console.error("Error in getcourse details", error);
      throw error;
    }
  }


  saveCourse =(paymentDetails:coursePayment , userId:string):Promise<string | null> =>{
    try {
      return this.userRepository.saveCourse(paymentDetails,userId)
     } catch (error) {
      console.error("Error in saving course payment", error);
      throw error;
    }
  }



  updateModuleCompletion =(moduleId:string,courseId:string, complete:boolean ):Promise<string | null> =>{
    try {
      return this.userRepository.updateModuleCompletion(moduleId,courseId,complete)
     } catch (error) {
      console.error("Error in saving course payment", error);
      throw error;
    }
  }


  
  submitReport(data: Reports): Promise<string | null> {
    try{
      return this.userRepository.submitReport(data)
    }catch(error){
      console.error("Error in submitting report", error);
      throw error;
    }
  }

  saveMeal(userId:string,name:string, meals:Meal[]): Promise<string | null> {
    try{
      return this.userRepository.saveMeal(userId,name,meals)
    }catch(error){
      console.error("Error in submitting report", error);
      throw error;
    }
  }
  




 
  

}
