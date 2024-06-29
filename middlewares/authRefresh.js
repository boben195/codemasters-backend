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
      
        await Session.findByIdAndDelete(sid);
        const newSession = await Session.create({ uid: user._id });
      
        const newAccessToken = jwt.sign(
           { uid: user._id, sid: newSession._id },
           JWT_SECRET,
           { expiresIn: "22h" }
           );
      
         const newRefreshToken = jwt.sign(
           { uid: user._id, sid: newSession._id },
           JWT_REFRESH_SECRET,
           { expiresIn: "22h" }
           );
      
         return res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          sid: newSession._id,
          message: "Woo hoo! You refresh token like a champ!"
           })
   
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};