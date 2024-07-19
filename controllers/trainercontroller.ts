import { Response, Request, NextFunction } from "express";
import { ResponseStatus } from "../constants/statusCodes";
import { isValidEmail } from "../validations/emailValidation";
import { isValidPassword } from "../validations/passwordValidations";
import { ItrainerInteractor } from "../interfaces/Itrainerinteractor";
import { Trainer } from "../entities/Trainer";
import bcrypt from "bcryptjs";
import { AUTH_ERRORS } from "../constants/errorHandling";
import { uploadS3Video } from "../utils/s3uploads";
import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3/dist-types/commands/CompleteMultipartUploadCommand";
import { trainerModel } from "../models/trainerModel";
import mongoose from 'mongoose';


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
          this.trainerData = Trainerdata
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


addslot = async (req: Request, res: Response, next: NextFunction) => {
  try {     
    console.log('entered the controller of the addslot');
    
    const id = typeof req.user_id === 'string'? req.user_id : '';

    if(!req.body){
      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message });

    }

    const slot = req.body

    if (!id) {
      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.TOKEN_INVALID.message });
    }

    const addedslot = await this.Interactor.addslot( id,slot);
    
    if (addedslot) {
      
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.FETCH_SUCCESS.message ,addedslot},);
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.USER_NOT_FOUND.message });

  } catch (error) {
    console.log('Entered catch block of addslot');
    next(error);
  }
}




getslots = async (req: Request, res: Response, next: NextFunction) => {
  try {     
    
    const id = typeof req.user_id === 'string'? req.user_id : '';

    if (!id) {
      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.TOKEN_INVALID.message });
    }

    const Details = await this.Interactor.getslots( id);
    if (Details) {
      
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.FETCH_SUCCESS.message ,Details},);
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.USER_NOT_FOUND.message });

  } catch (error) {
    console.log('Entered catch block of getslots ');
    next(error);
  }
}

getclients = async (req: Request, res: Response, next: NextFunction) => {
  try {     
    

    const clients = await this.Interactor.getclients();
    if (clients) {
      
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.FETCH_SUCCESS.message ,clients},);
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.USER_NOT_FOUND.message });

  } catch (error) {
    console.log('Entered catch block of getclients');
    next(error);
  }
}


getbookings = async (req: Request, res: Response, next: NextFunction) => {
  try {     
    
    const traineridd = this.trainerData._id; 
    if (!traineridd) {
      console.log('trainer id in get booking is ',traineridd);
      
      return res.status(ResponseStatus.BadRequest).json({ message: 'Trainer ID is undefined' });
    }    
    const bookings = await this.Interactor.getbookings(traineridd);
    console.log('bookings are ',bookings);
    
    if (bookings) {
      console.log('entered the booking controller ',bookings);
      
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.FETCH_SUCCESS.message ,bookings});
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message });

  } catch (error) {
    console.log('Entered catch block of getbookings');
    next(error);
  }
}



editSlot = async (req: Request, res: Response, next: NextFunction) => {
  try {     

    const trainerId = typeof req.user_id === 'string'? req.user_id : '';
    
    if (!trainerId)   return res.status(ResponseStatus.BadRequest).json({ message: 'Trainer ID is undefined' });
          
    const bodyrequest = req.body

    if(!bodyrequest)   return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message });

    const slotId = bodyrequest.slotid
    const formdata = bodyrequest.data

    const editedslot = await this.Interactor.editSlot(trainerId,slotId,formdata);
    console.log('edited slot is ',editedslot);
    
    if (editedslot) {
      console.log('entered the booking controller ',editedslot);
      
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.FETCH_SUCCESS.message ,editedslot});
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message });

  } catch (error) {
    console.log('Entered catch block of getbookings');
    next(error);
  }
}


addCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {     

    const trainerId = typeof req.user_id === 'string'? req.user_id : '';
    
    if (!trainerId)   return res.status(ResponseStatus.BadRequest).json({ message: 'Trainer ID is undefined' });

    const trainerdetails = await trainerModel.findOne({_id:trainerId})
       
    const bodyRequest = req.body    
    if(!bodyRequest)   return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message });  

    

    if(!trainerdetails)  {
      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.USER_NOT_FOUND.message });

    }else{
      
    bodyRequest.trainerId = trainerId    
    bodyRequest.author = trainerdetails.trainername
    bodyRequest.createdAt = new Date()
    }
      
    
    let videos = req.files as Express.Multer.File[];
    if (videos) {
      try {
        const videoUploadResults = await Promise.all(videos.map(file => uploadS3Video(file)));
        
        // Filter out any failed uploads
        const successfulUploads = videoUploadResults.filter(
          (result): result is CompleteMultipartUploadCommandOutput => 
            'Location' in result && typeof result.Location === 'string'
        );
    
        // Check if we have successful uploads for all videos
        if (successfulUploads.length === videos.length) {
          bodyRequest.modules.forEach((module: any, index: number) => {
            module.videoUrl = successfulUploads[index].Location;
          });
          console.log('Urls of the videos from the S3 bucket:', successfulUploads.map(url => url.Location));
        } else {
          console.error('Error in uploading one or more videos to S3:', videoUploadResults);
          return res.status(ResponseStatus.BadRequest).json({ message: "Error uploading one or more videos" });
        }
      } catch (error) {
        console.error('Error in uploading video to S3:', error);
        return res.status(ResponseStatus.BadRequest).json({ message: "Error uploading video" });
      }
    }

    const updatedCourse = await this.Interactor.addCourse(bodyRequest);

    if(!updatedCourse) return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.UPDATION_FAILED.message });

    return res.status(ResponseStatus.Created).json({ message: AUTH_ERRORS.UPDATION_SUCCESS.message });

  } catch (error) {
    console.log('Entered catch block of getbookings');
    next(error);
  }
}


getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {  
    const trainerId = typeof req.user_id === 'string' ? req.user_id : '';

    if (!trainerId) {
      return res.status(ResponseStatus.BadRequest).json({ message: 'Trainer ID is undefined' });
    }

    const trainerObjectId = new mongoose.Types.ObjectId(trainerId) as any;

    const availableCourses = await this.Interactor.getCourses(trainerObjectId as mongoose.Schema.Types.ObjectId);

    if (availableCourses) {
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.FETCH_SUCCESS.message, availableCourses });
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message });

  } catch (error) {
    console.log('Entered catch block of getCourses');
    next(error);
  }
}

getRevenueData = async (req: Request, res: Response, next: NextFunction) => {
  try {  
    const trainerId = typeof req.user_id === 'string' ? req.user_id : '';

    console.log('traien id string in controlleris',trainerId);
    

    if (!trainerId) {
      return res.status(ResponseStatus.BadRequest).json({ message: 'Trainer ID is undefined' });
    }


    const revenueData = await this.Interactor.revenueData(trainerId);

    if (revenueData) {
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.FETCH_SUCCESS.message, revenueData });
    }
    
    return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message });

  } catch (error) {
    console.log('Entered catch block of getCourses');
    next(error);
  }
}




}



