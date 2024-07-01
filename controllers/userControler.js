import User from "../models/user.js";
import cloudinary from "../helpers/cloudinary.js";

import path from "node:path";
import fs from "fs/promises"

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


const currentUser = async (req, res, next) => {
    try {
        const user = req.user;
        /*Тут має бути перевірка на авторизацію */
        const userProfile = { user: {
                name: user.name,
                email: user.email,
                gender: user.gender,
                weight: user.weight,
                activeTimeSport: user.activeTimeSport,
                dailyWaterRate: user.dailyWaterRate,
                avatarURL: user.avatarURL,
            }
        }
        res.status(200).json(userProfile);
    }
    catch (error) {
        next(error);
        }
}

const updateUser = async (req, res, next) => {
    try {
        const { _id } = req.user;
        
        const { name, email, gender, weight, activeTimeSport, dailyWaterRate } = req.body;
        let avatarURL;
        if (req.file) {
            const { path: tempPath, originalname } = req.file;
            const result = await cloudinary.uploader.upload(tempPath, {
                folder: "avatars",
                public_id: path.parse(originalname).name,
            });
            await fs.unlink(tempPath);
            avatarURL = result.secure_url;
        }
        const updateData = { name, email, gender, weight, activeTimeSport, dailyWaterRate };
        if (avatarURL) {
            updateData.avatarURL = avatarURL;
        }

        const update = await User.findByIdAndUpdate(_id, updateData, {new: true});

        if (!update) {
            return res.status(404).json({message: "There is no such user"})
        }
        res.status(200).json({
            user: {
                name: update.name,
                email: update.email,
                gender: update.gender,
                weight: update.weight,
                activeTimeSport: update.activeTimeSport,
                dailyWaterRate: update.dailyWaterRate,
                avatarURL: update.avatarURL,
            }
        })
    }
    catch (error) {
        next(error);
        }
}


const userServices = { currentUser, getAllUsers, updateUser };
export default userServices;