import { Response, Request, NextFunction } from "express";
import { ResponseStatus } from "../constants/statusCodes";
import { isValidEmail } from "../validations/emailValidation";
import { IadminInteractor } from "../interfaces/IadminInteractor";
import { AUTH_ERRORS } from "../constants/errorHandling";



export class adminController {
  private Interactor: IadminInteractor

  constructor(interactor: IadminInteractor) {
    this.Interactor = interactor
  }

  // for admin login

  
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.NO_DATA.message });
      }
    
      const admin = {
        email: req.body.email? req.body.email.trim() : null,
        password: req.body.password? req.body.password.trim() : null,
      };
  
      if (!admin.password ||!admin.email) {
        return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.EMPASS_REQUIRED.message });
      }
  
      if (!isValidEmail(admin.email)) {
        return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.INVALID_EMAIL.message });
      }
      

    const adminvalidate = await this.Interactor.adminLogin(admin.email, admin.password);

    if (adminvalidate) {
      return res.status(ResponseStatus.Accepted).json({ message: AUTH_ERRORS.LOGIN_SUCCESS.message });
    } else {
      return res.status(ResponseStatus.BadRequest).json({ message: AUTH_ERRORS.INVALID_CREDENTIALS.message });
    }
  
    } catch (error) {
      next(error);
    }
  };


  get_requests = async (req: Request, res: Response, next: NextFunction) => {
    try {      
      const trainers = await this.Interactor.get_requests()
      
      if(trainers){        
        return res 
        .status(ResponseStatus.Accepted)
        .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message,trainers:trainers })
      }
      return res 
      .status(ResponseStatus.NotFound)
      .json({ message: AUTH_ERRORS.USER_NOT_FOUND.message })
    
    
      
    } catch (error) {
      next(error);
    }
    
    }


  getTrainers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const trainers = await this.Interactor.getTrainers()
      
      if(trainers){        
        return res 
        .status(ResponseStatus.Accepted)
        .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message,trainers:trainers })
      }
      return res 
      .status(ResponseStatus.NotFound)
      .json({ message: AUTH_ERRORS.USER_NOT_FOUND.message })
    
    
      
    } catch (error) {
      next(error);
    }
    
    }
   


    trainerApproval = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const trainerId = req.params.id
      const trainers = await this.Interactor.trainerapproval(trainerId)
      
      if(trainers){        
        return res 
        .status(ResponseStatus.Accepted)
        .json({ message: AUTH_ERRORS.UPDATED.message })
      }
      return res 
      .status(ResponseStatus.NotFound)
      .json({ message: AUTH_ERRORS.USER_NOT_FOUND.message })
    
    
      
    } catch (error) {
      next(error);
    }
    
    }

    trainerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const trainerId = req.params.id
      const trainer = await this.Interactor.trainerDetails(trainerId)
      
      if(trainer){        
        return res 
        .status(ResponseStatus.Accepted)
        .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message ,trainer})
      }
      return res 
      .status(ResponseStatus.NotFound)
      .json({ message: AUTH_ERRORS.USER_NOT_FOUND.message })
    
    
      
    } catch (error) {
      next(error);
    }
    
    }


    addmeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if(!req.body){
        return res 
        .status(ResponseStatus.BadRequest)
        .json({ message: AUTH_ERRORS.NO_DATA.message })
      }

      const mealimage = req.file       

      const meals = req.body
      meals.image = mealimage?.filename
      const addedmeal = await this.Interactor.addmeal(meals)
      
      if(addedmeal){        
        return res 
        .status(ResponseStatus.Accepted)
        .json({ message: AUTH_ERRORS.UPDATION_SUCCESS.message ,addedmeal})
      }
      return res 
      .status(ResponseStatus.NotFound)
      .json({ message: AUTH_ERRORS.USER_NOT_FOUND.message })
    
    
      
    } catch (error) {
      next(error);
    }
    
    }

    getMeals = async (req: Request, res: Response, next: NextFunction) => {
      try {
        
        const meals = await this.Interactor.getMeals()
        
        if(meals){        
          return res 
          .status(ResponseStatus.Accepted)
          .json({ message: AUTH_ERRORS.FETCH_SUCCESS.message,meal:meals })
        }
        return res 
        .status(ResponseStatus.NotFound)
        .json({ message: AUTH_ERRORS.NO_DATA.message })
      
      
        
      } catch (error) {
        next(error);
      }
      
      }
  





  };






