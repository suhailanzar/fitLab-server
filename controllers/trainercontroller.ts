import { Response, Request, NextFunction } from "express";
import { ResponseStatus } from "../constants/statusCodes";
import { isValidEmail } from "../validations/emailValidation";
import { isValidPassword } from "../validations/passwordValidations";
import { trainerInteractor } from "../interactors/trainerinteractor";
import { ItrainerInteractor } from "../interfaces/Itrainerinteractor";
import { Trainer } from "../entities/Trainer";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AUTH_ERRORS } from "../constants/errorHandling";
import multer from "multer";

export class trainerController {
  private trainerData!: Trainer;
  private Interactor: ItrainerInteractor

  constructor(interactor: ItrainerInteractor) {
    this.Interactor = interactor
  }

  // for Trainer login

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.NO_DATA.message});
      }
      

      const Trainer = {
        email: req.body.email ? req.body.email.trim() : null,
        password: req.body.password ? req.body.password.trim() : null,
      };

      if (!Trainer.password || !Trainer.email) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.EMPASS_REQUIRED.message });
      }

      if (!isValidEmail(Trainer.email)) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.INVALID_EMAIL.message });
      }

      const TrainerExist = await this.Interactor.findtrainer(Trainer.email);
  


      if (TrainerExist) {
        const check = await this.Interactor.checkpass(
          Trainer.email,
          Trainer.password
        );

        if (!check) {
          return res
            .status(ResponseStatus.BadRequest)
            .json({ message: AUTH_ERRORS.INVALID_CREDENTIALS.message });
        }


        const Trainerdata = await this.Interactor.findtrainer(Trainer.email);

        if (Trainerdata) {
          if (Trainerdata.isblocked) {
            return res
              .status(ResponseStatus.BadRequest)
              .json({ message: AUTH_ERRORS.BLOCKED.message });
          } if (!Trainerdata.isapproved) {
            return res
              .status(ResponseStatus.BadRequest)
              .json({ message: AUTH_ERRORS.ADMIN_APPROVAL.message });
          }

          

          const token = await this.Interactor.jwt(Trainerdata);
          
          // const refreshToken = await this.Interactor.refreshToken(Trainerdata);
          return res.status(ResponseStatus.Accepted).json({
            message: "login successfull",
            token,
            Trainerdata,
          });
        }
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.USER_NOT_FOUND.message });
      }
    } catch (error) {
      next(error);
    }
  };

  // trainer signup

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }



      const { Trainername, email, password , specification } = req.body;


      if (!Trainername || !email || !password || !specification) {
        return res.status(ResponseStatus.BadRequest).json({
          message: AUTH_ERRORS.EMPASS_REQUIRED.message,
        });
      }


      if (!isValidEmail(email)) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.INVALID_EMAIL.message });
      }


      if (!isValidPassword(password)) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.INVALID_PASSWORD.message});
      }

      const encryptedpassword = bcrypt.hashSync(password, 10);

      this.trainerData = {
        trainername:Trainername,
        email:email,
        specification:specification,
        password: encryptedpassword,
        isblocked: false,
        isapproved:false,

      };

      const datas = await this.Interactor.findtrainer(this.trainerData.email)


      if (datas) {
       return  res.status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.USER_EXIST.message });
      }

      const mailsend = await this.Interactor.sendmail(this.trainerData.email);

      console.log('mailsend data is ', mailsend);

      return res
        .status(ResponseStatus.OK)
        .json({ message: `Check ${this.trainerData.email}` });
    } catch (error) {
      next(error);
    }
  }; 



  otp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.EMPASS_REQUIRED.message })
      }
      const { inputone, inputtwo, inputthree, inputfour } = req.body;
      
      // Concatenate the input values as strings
      const combinedString = `${inputone}${inputtwo}${inputthree}${inputfour}`;

      // Convert the concatenated string to a number
      const combinedNumber = Number(combinedString);
      const checkingotp = await this.Interactor.otpcheck(combinedNumber, this.trainerData.email)

      
      if (checkingotp.isExpired) {

        return res
        .status(ResponseStatus.BadRequest)
        .json({ message: AUTH_ERRORS.OTP_EXPIRED.message })
      }
      if (checkingotp.isValid) {

        const createTrainer = await this.Interactor.Registertrainer(this.trainerData)
        if(createTrainer){
         return res
         .status(ResponseStatus.Created)
         .json({ message: AUTH_ERRORS.REGISTER_SUCCESS.message });
        }else{
          return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.REGISTER_FAILED.message });
        }
        
      } else {
          return res 
          .status(ResponseStatus.BadRequest)
          .json({ message:AUTH_ERRORS.OTP_INVALID.message })

      }

    } catch (error) {
      console.log('enterd catch block');
      next(error);
    }
  }


  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
      
    try {     
     const resendedotp =  await this.Interactor.sendmail(this.trainerData.email)
     if(resendedotp){
       return res.status(ResponseStatus.Accepted).json({message:AUTH_ERRORS.OTP_RESEND.message})
     }
     return res.status(ResponseStatus.BadRequest).json({message:AUTH_ERRORS.OTP_FAILED.message})


    } catch (error) {
     console.log('entered catch block');
     next(error);
    }
   
 
 }

 editProfileTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {     
    const id = typeof req.user_id === 'string'? req.user_id : '';
    let profilePic = req.file as Express.Multer.File
    
    console.log('image in controller is ',profilePic);
    
    if (!id) {
      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.TOKEN_INVALID.message });
    }

    const updatedData = req.body;
    

    const updatedDetails = await this.Interactor.editProfileTrainer(updatedData, id , profilePic);
    if (updatedDetails) {
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.UPDATED.message });
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.REGISTER_FAILED.message });

  } catch (error) {
    console.log('Entered catch block of edit profile trainer');
    next(error);
  }
}



getprofile = async (req: Request, res: Response, next: NextFunction) => {
  try {     
    
    const id = typeof req.user_id === 'string'? req.user_id : '';

    if (!id) {
      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.TOKEN_INVALID.message });
    }

    const Details = await this.Interactor.getprofile( id);
    if (Details) {
      
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.FETCH_SUCCESS.message ,Details},);
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.USER_NOT_FOUND.message });

  } catch (error) {
    console.log('Entered catch block of edit profile trainer');
    next(error);
  }
}




}



