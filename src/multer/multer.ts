import multer from "multer";
let storage = multer.memoryStorage();
export const upload = multer({ storage: storage });