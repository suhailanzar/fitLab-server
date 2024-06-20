
import multer from 'multer';

const imageStorage = multer.memoryStorage();

export const trainerpofileupload = multer({ storage: imageStorage });
