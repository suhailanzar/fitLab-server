
import multer from 'multer';

const imageStorage = multer.memoryStorage();

export const trainerpofileupload = multer({ storage: imageStorage });
export const userpofileupload = multer({ storage: imageStorage });
export const videoupload = multer({ storage: imageStorage });
