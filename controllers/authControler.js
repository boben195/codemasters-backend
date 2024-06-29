import User from "../models/user.js";

import Session from "../models/session.js";

import bcrypt from "bcryptjs";
import cripto from "node:crypto";
import jwt from "jsonwebtoken";
import mailer from "../helpers/mailer.js";
import HttpError from "../helpers/HttpError.js";
import queryString from 'query-string';
import axios from "axios";




const JWT_SECRET = process.env.JWT_SECRET;

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const registerUser = async (req, res, next) => {
    try {
        const {  email, password, password_conform } = req.body;
        if (password !== password_conform) {
            return res.status(400).json({message: "Passwords dont match. Enter correct!"})
        }

        const user = await User.findOne({ email });
        if (user !== null) {
            return res.status(409).send({message: "Email already exist"})
        }
        const verificationToken = cripto.randomUUID();

        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email, password: passwordHash, verificationToken })

        // Uncomment if verify email feature used
        // await mailer.sendVerificationEmail(email, verificationToken);

        /*Тут має бути граватар */

        res.status(201).json({user: {
                "name": newUser.name,
                "email": newUser.email,
                "gender": newUser.gender,
                "weight": newUser.weight,
                "activeTimeSport": newUser.activeTimeSport,
                "dailyWaterRate": newUser.dailyWaterRate,
                "avatarURL": newUser.avatarURL,
            }
        })
    }
    catch(error) {
        next(error)
    }
}




const login = async (req, res, next) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user === null) {
        return res.status(404).send({message: "User not found"})
    }
    // Uncomment if verify email feature used
    // if (!user.verify) {
    //     return res.status(403).send({message: "Email requires confirmation!"})
    // }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (passwordCompare === false) {
        return res.status(401).send({message: "Email or password is wrong"})
    }
    const newSession = await Session.create({ uid: user._id });
  
  const accessToken = jwt.sign(
    { uid: user._id, sid: newSession._id },
    JWT_SECRET,
    { expiresIn: "22h" }
  );
  
  const refreshToken = jwt.sign(
    { uid: user._id, sid: newSession._id },
      JWT_REFRESH_SECRET,
    { expiresIn: "22h" }
        );

       return res.status(200).json({
           accessToken,
           refreshToken,
           user: {
                   "name": user.name,
                   "email": user.email,
                   "gender": user.gender,
                   "weight": user.weight,
                   "activeTimeSport": user.activeTimeSport,
                   "dailyWaterRate": user.dailyWaterRate,
                   "avatarURL": user.avatarURL,
               }
       });
    }
    catch(error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        const { sid } = req.user
        await Session.findByIdAndDelete(sid);
        res.status(204).json({ message: "Successfully logged out" });
    }
    catch(error) {
        next(error)
    }

}

// это ты перенесешь в слой для рефреша, я так понял.
const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).send({message: "Refresh token is required"})
    }

    try {
        if(!Session) {
            return res.status(401).send({message: "Invalid refresh token"})
        }


        const user = await User.findById(decoded.uid);
        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        const newAccessToken = jwt.sign(
            { uid: user._id, sid: session._id },
            JWT_SECRET,
            { expiresIn: "22h" }
        );

        const newRefreshToken = jwt.sign(
            { uid: user._id, sid: session._id },
            JWT_REFRESH_SECRET,
            { expiresIn: "22h" }
        );

        return res.status(200).json({token: newAccessToken, refreshToken: newRefreshToken})
    }
    
    catch(error) {
        next(error)
    }
}


const verificationEmail = async (req, res, next) => {
    try {
        const {verificationToken} = req.params;
        const user = await User.findOne({verificationToken});
        if (!user) throw HttpError(404, "User not found");

        const verifiedUser = await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null}, {new: true});
        if (verifiedUser) {
            res.status(200).json({
                message: "Verification successful"
            });
        }
    } catch (e) {
        next(e);
    }
};

const resendVerificationEmail = async (req, res, next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if (!user) throw HttpError(404, "User not found");
        if (user.verify) throw HttpError(400, "Verification has already been passed");

        await mailer.sendVerificationEmail(user.email, user.verificationToken);
        res.status(200).json({
            message: "Verification email sent"
        });
    } catch (e) {
        next(e)
    }
};

// !!!  Богдан, BASE_URL, которую ты юзаешь далее нет в енв файле.
// Может уточнить что за урл, например:  APP_BASE_URL?

// const googleAuth = async (req, res, next) => {
//     const stingifiedParams = queryString.stringify({
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
//         scope: [
//               "https://www.googleapis.com/auth/userinfo.email",
//               "https://www.googleapis.com/auth/userinfo.profile",
//                   ].join(" "),
//         response_type: "code",
//         access_type: "offline",
//         prompt: "consent",
//     });
//    return res.redirect(
//     `https://accounts.google.com/o/oauth2/v2/auth?${stingifiedParams}`
//     )
// }
//
// const googleRedirect = async (req, res, next) => {
//     const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
//     const urlObj = new URL(fullUrl);
//     const urlParams = queryString.parse(urlObj.search);
//     const code = urlParams.code;
//     const tokenData = await axios({
//     url: `https://oauth2.googleapis.com/token`,
//     method: "post",
//     data: {
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
//       grant_type: "authorization_code",
//       code,
//          },
//      });
//     const userData = await axios({
//       url: "https://www.googleapis.com/oauth2/v2/userinfo",
//       method: "get",
//       headers: {
//          Authorization: `Bearer ${tokenData.data.access_token}`,
//         },
//      });
//      let existingParent = await UserModel.findOne({ email: userData.data.email });
//         if (!existingParent || !existingParent.originUrl) {
//             return res.status(403).send({
//               message:
//                   "You should register from front-end first.",
//               });
//       }
//     const newSession = await Session.create({ uid: existingParent._id });
//
//   const token = jwt.sign(
//     { uid: existingParent._id, sid: newSession._id },
//     JWT_SECRET,
//     { expiresIn: "22h" }
//   );
//
//   const refreshToken = jwt.sign(
//     { uid: existingParent._id, sid: newSession._id },
//       JWT_REFRESH_SECRET,
//     { expiresIn: "22h" }
//     );
//     return res.redirect(
//     `${existingParent.originUrl}?accessToken=${token}&refreshToken=${refreshToken}&sid=${newSession._id}`
//   );
// }

const userServices = { registerUser, login, logout, refreshToken, verificationEmail, resendVerificationEmail };
export default userServices;