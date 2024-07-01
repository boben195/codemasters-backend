import User from "../models/user.js";
import jwt from "jsonwebtoken";
import Session from "../models/session.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const authRefresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
        return res.status(401).json({ message: "There is no refresh token" });
    }

  try {
        const { uid, sid } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const session = await Session.findById(sid);

        
        const user = await User.findById(uid);

        if (!user || !session) {
            return res.status(401).json({ message: "User not found" });
        }
      
        req.user = { uid: user._id, ...user.toObject() };
        next();
   
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};