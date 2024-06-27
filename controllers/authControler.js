import User from "../models/user.js";

import Session from "../models/session.js";

import bcrypt from "bcryptjs";
import cripto from "node:crypto";
import jwt from "jsonwebtoken";




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
        /*Тут має бути граватар */
        /*Тут має бути верифікація емейла */
        res.status(201).json({email: newUser.email, message: "New user is born"})
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
            return res.status(401).send({message: "Email or password is wrong"})
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
        if (passwordCompare === false) {
            return res.status(401).send({message: "Email or password is wrong"})
        }
    const newSession = await Session.create({ uid: user._id });
  
  const token = jwt.sign(
    { uid: user._id, sid: newSession._id },
    JWT_SECRET,
    { expiresIn: "22h" }
  );
  
  const refreshToken = jwt.sign(
    { uid: user._id, sid: newSession._id },
      JWT_REFRESH_SECRET,
    { expiresIn: "22h" }
        );
        

    /*Цей код зберігає аксес токен до бази. Коментуйте цю частину якщо не бажаєте зберігати. Зроблено для перевірки */
        // user.token = token;
        // await user.save();
    /*Цей код зберігає аксес токен до бази. Коментуйте цю частину якщо не бажаєте зберігати. Зроблено для перевірки */
        

       return res.status(200).json({token, refreshToken, sid: newSession._id, email: user.email,})
    }
    catch(error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        const { uid, sid } = req.user
        await Session.findByIdAndDelete(sid);

        /*Цей рядок видаляє токен з бази - закоментуйте його якщо коментувал код в login. Зроблено для перевірки */
        // await User.findByIdAndUpdate(uid, { token: null });
        /*Цей рядок видаляє токен з бази - закоментуйте його якщо коментувал код в login. Зроблено для перевірки */
        /*Тут могла бути ваша реклама */

        res.status(204).json({ message: "Successfully logged out" });
    }
    catch(error) {
        next(error)
    }

}

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





const userServices = { registerUser, login, logout, refreshToken };
export default userServices;