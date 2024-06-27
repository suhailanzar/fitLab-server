import { Trainer } from "../entities/Trainer";
import { Slot } from "../entities/Trainer";
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


  addslot = async (id:string,slot:Slot): Promise< string | null> => {
    try {
      
      return await this.trainerrepository.addslot(id,slot);
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


}
