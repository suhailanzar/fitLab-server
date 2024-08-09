import { IadminInteractor } from "../interfaces/IadminInteractor";
import { IadminRepository } from "../interfaces/IadminRepository";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Trainer } from "../entities/Trainer";
import { Meal } from "../entities/admin";
import { Reports, User } from "../entities/user";

dotenv.config();

export class adminInteractor implements IadminInteractor {
  private adminRepository: IadminRepository;

  constructor(adminrepository: IadminRepository) {
    this.adminRepository = adminrepository;
  }


  adminLogin = async (email: string, pass: string): Promise<boolean> => {
    return this.adminRepository.adminLogin(email, pass)
  };

  get_requests = async (): Promise<Array<Trainer>> => {
    return this.adminRepository.get_requests()
  }

  getTrainers = async (): Promise<Array<Trainer>> => {
    return this.adminRepository.getTrainers()
  }

  getUsers = async (): Promise<Array<User> | null> => {
    return this.adminRepository.getUsers()
  }

  trainerapproval = async (trainerId: string): Promise<any> => {
    return this.adminRepository.trainerapproval(trainerId)
  }

  blockTrainer = async (trainerId: string): Promise<string | null> => {
    return this.adminRepository.blockTrainer(trainerId)
  }

  blockUser = async (userId: string): Promise<string | null> => {
    return this.adminRepository.blockUser(userId)
  }

  trainerDetails = async (trainerId: string): Promise<any> => {
    return this.adminRepository.trainerDetails(trainerId)
  }

  userDetails = async (userId: string): Promise<any> => {
    return this.adminRepository.userDetails(userId)
  }

  addmeal = async (meal: Meal): Promise<string | null> => {
    return this.adminRepository.addmeal(meal)
  }

  getMeals = (): Promise<any> => {
    return this.adminRepository.getMeals()
  }


  getReports = async (): Promise<Reports[] | null> => {
    try {
      return await this.adminRepository.getReports();
    } catch (error) {
      console.error('Error fetching reports:', error);
      return null;
    }
  }


  findUser = async (id: string): Promise<User | null> => {
    try {
      return await this.adminRepository.findUser(id);
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  };





}
