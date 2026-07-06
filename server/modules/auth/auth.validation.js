import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required()
    .messages({ 'string.alphanum': 'Username must be alphanumeric' }),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({ 'string.pattern.base': 'Password must contain uppercase, lowercase, and number' }),
  fullName: Joi.string().min(2).max(100).required(),
});

export const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
