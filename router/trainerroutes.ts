import { Router } from 'express';
import { trainerRepository } from '../repositories/trainerRepository';
import { trainerInteractor } from '../interactors/trainerinteractor';
import { trainerController } from '../controllers/trainercontroller';
import  authenticateTrainerToken  from '../middlewares/trainer_authmiddleware';
import { trainerpofileupload,videoupload } from '../utils/multer';

const router = Router();

// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new trainerRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new trainerInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new trainerController(interactor);

//call the onsignup method of the Usercontroller instance to handle the signup process
router.post("/signup", controller.signup.bind(controller));
router.post('/login',controller.login.bind(controller))
router.post('/otp',controller.otp.bind(controller))
router.post('/resendOtp',controller.resendOtp.bind(controller))
router.patch('/editProfile',authenticateTrainerToken,trainerpofileupload.single('image'),controller.editProfileTrainer.bind(controller))
router.get('/getprofile',authenticateTrainerToken,controller.getprofile.bind(controller))
router.post('/addslot',authenticateTrainerToken,controller.addslot.bind(controller))
router.post('/editSlot',authenticateTrainerToken,controller.editSlot.bind(controller))
router.get('/getslots',authenticateTrainerToken,controller.getslots.bind(controller))
router.get('/clients',authenticateTrainerToken,controller.getclients.bind(controller))
router.get('/getbookings',authenticateTrainerToken,controller.getbookings.bind(controller))
router.get('/getCourses',authenticateTrainerToken,controller.getCourses.bind(controller))
router.post('/addCourse',authenticateTrainerToken,videoupload.any(),controller.addCourse.bind(controller))
router.post('/getMessagesTrainer',authenticateTrainerToken,controller.getMessagesTrainer.bind(controller))
router.get("/getRevenueData",authenticateTrainerToken,controller.getRevenueData.bind(controller))
router.get("/deleteSlot/:id",authenticateTrainerToken,controller.deleteSlot.bind(controller))



export default router;