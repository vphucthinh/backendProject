import multer from "multer";
import {config} from "../config/config.js ";

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadStorage);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Create the multer instance
const upload = multer({ storage });

export default upload;
