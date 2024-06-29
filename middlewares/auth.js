import User from "../models/user.js";
import jwt from "jsonwebtoken";
import Session from "../models/session.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: "Authorization header missing" });
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).send({ message: "Invalid authorization format" });
  }

  try {
    const { uid, sid } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }
    const session = await Session.findById(sid);
    if (!session) {
      return res.status(401).send({ message: "Session invalid or expired" });
    }

    req.user = { uid: user._id, sid, ...user.toObject() };
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};



