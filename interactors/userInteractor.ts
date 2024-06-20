import { User } from "../entities/user";
import { IuserInteractor } from "../interfaces/Iuserinteractor";
import { IuserRepository } from "../interfaces/IuserRepository";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
      console.log('entered the interactor user');

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

    console.log('entered otpcheck interactor', otp);
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

}
