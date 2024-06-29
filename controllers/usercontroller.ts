import { Response, Request, NextFunction } from "express";
import { ResponseStatus } from "../constants/statusCodes";
import { isValidEmail } from "../validations/emailValidation";
import { isValidPassword } from "../validations/passwordValidations";
import { userInteractor } from "../interactors/userInteractor";
import { IuserInteractor } from "../interfaces/Iuserinteractor";
import { User } from "../entities/user";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AUTH_ERRORS } from "../constants/errorHandling"

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


  savepayment = async (req: Request, res: Response, next: NextFunction) => {
    try {

      if (!req.body) {
        return res
          .status(ResponseStatus.BadRequest)
          .json({ message: AUTH_ERRORS.NO_DATA.message });
      }
    
      const paymentdetails = req.body
      console.log('dataform paymentis ',paymentdetails);
      
      const results = await this.Interactor.savepayment(paymentdetails);
      res.json(results);

 
    } catch (error) {
      console.log('enterd catch block');
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

      console.log('messagess werer',results);
      
  
      if (results) {
        return res
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message , messages:results });
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

}
