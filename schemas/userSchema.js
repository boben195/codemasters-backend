import Joi from "joi";

export const registerSchema = Joi.object({
  
  email: Joi.string().required(),
  password: Joi.string().required(),
  
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});