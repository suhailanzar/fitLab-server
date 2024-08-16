import { userRepository } from '../repositories/userRepository';
import { userInteractor } from '../interactors/userInteractor';
import { userController } from '../controllers/usercontroller';
import { Router, Request, Response } from 'express';
import { ResponseStatus } from '../constants/statusCodes';
import { reportfile, userpofileupload } from '../utils/multer';
import authenticateUserToken from '../middlewares/user_authmiddleware';

const router = Router();

// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new userRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new userInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new userController(interactor);

//call the onsignup method of the Usercontroller instance to handle the signup process
router.post("/signup", controller.signup.bind(controller));
router.post('/login',controller.login.bind(controller))
router.post('/otp',controller.otp.bind(controller))
router.post('/resendOtp',controller.resendOtp.bind(controller))
router.post('/bookslot',authenticateUserToken,controller.bookslot.bind(controller))
router.post("/getMessages",authenticateUserToken,controller.getMessages.bind(controller))
router.post("/editprofile",authenticateUserToken,userpofileupload.single('image'),controller.editprofile.bind(controller))
router.post("/subscribe",authenticateUserToken,controller.subscribe.bind(controller))
router.post("/saveCourse",authenticateUserToken,controller.saveCourse.bind(controller))
router.post("/submitReport",authenticateUserToken,reportfile.single('evidence'),controller.submitReport.bind(controller))
router.post("/saveMeal",authenticateUserToken,controller.saveMeal.bind(controller))

router.get("/gettrainers",authenticateUserToken,controller.getTrainers.bind(controller))
router.get("/searchtrainers",authenticateUserToken,controller.searchtrainers.bind(controller))
router.get("/getprofile",authenticateUserToken,controller.getprofile.bind(controller))
router.get("/getCourse",authenticateUserToken,controller.getCourse.bind(controller))
router.get("/getCourseDetails/:id",authenticateUserToken,controller.getCourseDetails.bind(controller))
router.get("/getPurchasedCourses",authenticateUserToken,controller.getPurchasedCourses.bind(controller))
router.get("/getReportsUser",authenticateUserToken,controller.getReportsUser.bind(controller))
router.put("/updateModuleCompletion/:moduleId/:courseId", authenticateUserToken, controller.updateModuleCompletion.bind(controller));


router.get('/activate', (req: Request, res: Response) => {
    res.status(ResponseStatus.OK).json({ message: 'chat iniated to backend' });
})


export default router;