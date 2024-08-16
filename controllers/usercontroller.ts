import { Response, Request, NextFunction, response } from "express";
import { ResponseStatus } from "../constants/statusCodes";
import { isValidEmail } from "../validations/emailValidation";
import { isValidPassword } from "../validations/passwordValidations";
import { IuserInteractor } from "../interfaces/Iuserinteractor";
import { User } from "../entities/user";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AUTH_ERRORS } from "../constants/errorHandling"
import { uploadS3Image, uploadS3ProfileImage } from "../utils/s3uploads";

export class userController {
  private userdatas!: User;
  private Interactor: IuserInteractor

  constructor(interactor: IuserInteractor) {
    this.Interactor = interactor
  }

  // for user login

  login = async (req: Request, res: Response, next: NextFunction) => {

    try {
      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }


      const user = {
        email: req.body.email ? req.body.email.trim() : null,
        password: req.body.password ? req.body.password.trim() : null,
      };

      if (!user.password || !user.email) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.EMPASS_REQUIRED.message });
      }

      if (!isValidEmail(user.email)) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.INVALID_EMAIL.message });
      }

      const userExist = await this.Interactor.findUser(user.email);



      if (userExist) {
        const check = await this.Interactor.checkpass(
          user.email,
          user.password
        );

        if (!check) {
          return res
            .status(ResponseStatus.BadRequest)
            .json({ message: AUTH_ERRORS.INVALID_CREDENTIALS.message });
        }


        const userdata = await this.Interactor.findUser(user.email);

        console.log('user data is ', userdata);


        if (userdata) {
          if (userdata.isblocked) {
            return res
              .status(ResponseStatus.BadRequest)
              .json({ message: AUTH_ERRORS.BLOCKED.message });
          }

          const token = await this.Interactor.jwt(userdata);

          // const refreshToken = await this.Interactor.refreshToken(userdata);
          return res.status(ResponseStatus.Accepted).json({
            message: AUTH_ERRORS.LOGIN_SUCCESS.message,
            token,
            userdata,
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

  // user signup

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }

      const { username, email, password } = req.body;

      if (!username || !email || !password) {
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
          .json({ message: AUTH_ERRORS.INVALID_PASSWORD.message });
      }

      const encryptedpassword = bcrypt.hashSync(password, 10);

      this.userdatas = {
        username,
        email,
        password: encryptedpassword,
        isblocked: false,
      };

      const datas = await this.Interactor.findUser(this.userdatas.email)


      if (datas) {
        return res.status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.USER_EXIST.message });
      }

      const mailsend = await this.Interactor.sendmail(this.userdatas.email);

      console.log('mailsend data is ', mailsend);

      return res
        .status(ResponseStatus.OK)
        .json({ message: `Check ${this.userdatas.email}` });
    } catch (error) {
      next(error);
    }
  };


  // OTP FOR USER

  otp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message })
      }
      const { inputone, inputtwo, inputthree, inputfour } = req.body;
      // Concatenate the input values as strings
      const combinedString = `${inputone}${inputtwo}${inputthree}${inputfour}`;

      // Convert the concatenated string to a number
      const combinedNumber = Number(combinedString);
      const checkingotp = await this.Interactor.otpcheck(combinedNumber, this.userdatas.email)

      if (checkingotp.isExpired) {

        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.OTP_EXPIRED.message })
      }
      if (checkingotp.isValid) {

        const createuser = await this.Interactor.RegisterUser(this.userdatas)
        if (createuser) {
          return res
            .status(ResponseStatus.Created)
            .json({ message: AUTH_ERRORS.REGISTER_SUCCESS.message });
        } else {
          return res
            .status(ResponseStatus.BadRequest)
            .json({ message: AUTH_ERRORS.REGISTER_FAILED.message });
        }

      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.OTP_INVALID.message })

      }

    } catch (error) {
      next(error);
    }
  }


  resendOtp = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const resendedotp = await this.Interactor.sendmail(this.userdatas.email)
      if (resendedotp) {
        return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.OTP_RESEND.message })
      }
      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.OTP_FAILED.message })


    } catch (error) {
      next(error);
    }


  }




  getTrainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainers = await this.Interactor.getTrainer()

      if (trainers) {
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message, trainers: trainers })
      }
      return res
        .status(ResponseStatus.NotFound)
        .json({ message: AUTH_ERRORS.USER_NOT_FOUND.message })



    } catch (error) {
      console.log('enterd catch block');
      next(error);
    }

  }


  searchtrainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q;

      if (typeof query !== 'string') {
        return res.status(400).json({ message: 'Query parameter q must be a string' });
      }

      const results = await this.Interactor.searchTrainer(query);
      res.json(results);


    } catch (error) {
      console.log('enterd catch block');
      next(error);
    }

  }


  bookslot = async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }

      const paymentdetails = req.body
      console.log('dataform paymentis ', paymentdetails);

      const results = await this.Interactor.bookslot(paymentdetails);
      res.json(results);


    } catch (error) {
      console.log('enterd catch block');
      next(error);
    }

  }


  editprofile = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const id = typeof req.user_id === 'string' ? req.user_id : '';

      let profilePic = req.file as Express.Multer.File;
      console.log('profile picture is ', profilePic);

      let s3Response: any = {};

      if (profilePic) {
        s3Response = await uploadS3ProfileImage(profilePic);
        if (!s3Response.error) {
          console.log('url of the image from the s3 bucket', s3Response.Location);
        } else {
          console.log('error in uploading image to cloud');
          return res.status(ResponseStatus.BadRequest).json({ message: "Error uploading image" });
        }
      }

      console.log('image in controller is', profilePic);

      if (!id) {
        return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.TOKEN_INVALID.message });
      }

      const updatedData = req.body;
      const updatedDetails = await this.Interactor.editprofile(updatedData, id, s3Response);

      if (updatedDetails) {
        return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.UPDATED.message, profile: updatedDetails });
      }

      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.REGISTER_FAILED.message });

    } catch (error) {
      console.log('Entered catch block of edit profile trainuserer');
      next(error);
    }

  }


  getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        console.log('no request from body');
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: 'Request body is missing' });
      }

      const data = req.body;
      const results = await this.Interactor.getMessages(data);


      if (results) {
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message, messages: results });
      } else {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }
    } catch (error) {
      console.error('Error in getMessages:', error);
      return res
        .status(ResponseStatus.BadRequest)
        .json({ message: 'An error occurred while processing the request' });
    }
  };



  getprofile = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const id = typeof req.user_id === 'string' ? req.user_id : '';
      console.log('id is', id);


      const userprofile = await this.Interactor.getuserprofile(id)

      if (userprofile) {
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message, profile: userprofile })
      }
      return res
        .status(ResponseStatus.NotFound)
        .json({ message: AUTH_ERRORS.USER_NOT_FOUND.message })



    } catch (error) {
      console.log('enterd catch block');
      next(error);
    }

  }




  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }

      const id = typeof req.user_id === 'string' ? req.user_id : '';
      console.log('id is', id);

      const paymentdetails = req.body
      console.log('dataform paymentis ', paymentdetails);

      const results = await this.Interactor.subscribe(paymentdetails, id);
      if (!results) return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.REGISTER_FAILED.message });
      res.json(results);


    } catch (error) {
      console.log('enterd catch block');
      next(error);
    }

  }

  getCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = 4;

      console.log('getcourse',page,limit);
      

      const { courses, totalCourses } = await this.Interactor.getCourse(page, limit);

      return res.status(ResponseStatus.Accepted).json({
        courses,
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses
      });
    } catch (error) {
      console.log('Entered catch block of getCourse');
      next(error);
    }
  };

  getCourseDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.body) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: AUTH_ERRORS.NO_DATA.message })
      }

      let courseid = req.params.id

      console.log('id in the controller is courseid', courseid);


      const getCoursedetails = await this.Interactor.getCoursedetails(courseid)

      console.log('course detial is', getCoursedetails);


      if (getCoursedetails) {
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message, course: getCoursedetails })
      }
      return res
        .status(ResponseStatus.NotFound)
        .json({ message: AUTH_ERRORS.NO_DATA.message })



    } catch (error) {
      console.log('enterd catch block of getCourse');
      next(error);
    }

  }

  saveCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.body) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }

      const userId = req.user_id;
      const paymentDetails = req.body

      if (!userId || !paymentDetails) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }

      const saveCourseResult = await this.Interactor.saveCourse(paymentDetails, userId);

      if (saveCourseResult) {
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.PAYMENT_SUCCESS.message });
      }

      return res
        .status(ResponseStatus.NotFound)
        .json({ message: AUTH_ERRORS.PAYMENT_FAILED.message });

    } catch (error) {
      console.log('entered catch block of saveCourse');
      next(error);
    }
  }



  
  getPurchasedCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user_id;

      if (!userId ) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }

      const courses = await this.Interactor.getPurchasedCourses( userId);


      if (courses) {
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message ,Enrolled:courses.Enrolled,Courses:courses.courses});
      }

   
    } catch (error) {
      console.log('Entered catch block of getCourse');
      next(error);
    }
  };



  
  updateModuleCompletion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user_id;
      const { courseId, moduleId } = req.params;
    const { completed } = req.body;

    console.log('detialare ',courseId,moduleId,completed);
    

      if (!userId ) {
        return res
          .status(ResponseStatus.NotFound)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }

      const completion = await this.Interactor.updateModuleCompletion(moduleId,courseId,completed );


      if (completion) {
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message });
      }

   
    } catch (error) {
      console.log('Entered catch block of getCourse');
      next(error);
    }
  };


  submitReport  = async (req:Request,  res:Response,  next:NextFunction)=>{

    if(!req.body){
      return res.status(ResponseStatus.NotFound).json({success:false,message: AUTH_ERRORS.NO_DATA.message})
    }
    const userId = req.user_id;
    const body = req.body
    let ReportPic = req.file as Express.Multer.File;

    if (ReportPic) {
      console.log(ReportPic)
      body.evidence = ReportPic.filename;
    }
    body.userId = userId

    const updatedData = await this.Interactor.submitReport(body)

    console.log('updaeed data in the controller is',updatedData);
    
    if(updatedData!=null){
      return res.status(ResponseStatus.Created).json({success:true,message:AUTH_ERRORS.UPDATION_SUCCESS.message})
    }

    return res.status(ResponseStatus.BadRequest).json({success:false,message:AUTH_ERRORS.UPDATION_FAILED.message})

    

  }

  saveMeal  = async (req:Request,  res:Response,  next:NextFunction)=>{

    if(!req.body){
      return res.status(ResponseStatus.NotFound).json({success:false,message: AUTH_ERRORS.NO_DATA.message})
    }
     const userId = req.user_id;
    const savedName = req.body.name.mealName
    const meals = req.body.meal

    if(userId) {
      const updatedData = await this.Interactor.saveMeal(userId,savedName,meals)
      if(updatedData!=null){
        return res.status(ResponseStatus.Created).json({success:true,message:AUTH_ERRORS.UPDATION_SUCCESS.message})
      }
    }

    return res.status(ResponseStatus.BadRequest).json({success:false,message:AUTH_ERRORS.UPDATION_FAILED.message})

  }


  
  getReportsUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const userId = req.user_id;

      if(userId){
        const Reports = await this.Interactor.getReportsUser(userId)
        if (Reports) {
          return res
            .status(ResponseStatus.Accepted)
            .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message, reports: Reports })
        }

      }
    
      return res
        .status(ResponseStatus.NotFound)
        .json({ message: AUTH_ERRORS.NO_DATA.message })



    } catch (error) {
      next(error);
    }

  }

}
