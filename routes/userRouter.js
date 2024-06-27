import express from "express";

import userServices from "../controllers/userControler.js";
import { auth } from "../middlewares/auth.js"
import upload from "../middlewares/multer.js"

const usersRouter = express.Router();

usersRouter.get("/current", auth, userServices.currentUser);

usersRouter.get("/all", userServices.getAllUsers);

usersRouter.patch("/update", auth, upload.single("avatarURL"), userServices.updateUser);
    
export default usersRouter;
