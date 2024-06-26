import express from "express";

import userServices from "../controllers/userControler.js";
import { auth } from "../middlewares/auth.js"
import limitUpload from "../middlewares/multer.js";


/* endpoint: /users */
const usersRouter = express.Router();

usersRouter.get("/current", auth, userServices.currentUser);

usersRouter.get("/all", userServices.getAllUsers);

usersRouter.patch("/update", auth, limitUpload, userServices.updateUser);
    
export default usersRouter;
