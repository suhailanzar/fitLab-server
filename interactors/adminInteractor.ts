import { IadminInteractor } from "../interfaces/IadminInteractor";
import { IadminRepository } from "../interfaces/IadminRepository";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Trainer } from "../entities/Trainer";

dotenv.config();

export class adminInteractor implements IadminInteractor {
  private adminRepository: IadminRepository;

  constructor(adminrepository: IadminRepository) {
    this.adminRepository = adminrepository;
  }

  
  adminLogin = (email: string , pass:string): Promise<boolean> => {
    return this.adminRepository.adminLogin(email,pass)
  };

  get_requests =():Promise<Array<Trainer>> =>{
    return this.adminRepository.get_requests()
  }

  getTrainers =():Promise<Array<Trainer>> =>{
    return this.adminRepository.getTrainers()
  }
  trainerapproval =(trainerId:string):Promise<any> =>{
    return this.adminRepository.trainerapproval(trainerId)
  }
  trainerDetails =(trainerId:string):Promise<any> =>{
    return this.adminRepository.trainerapproval(trainerId)
  }
  

}
