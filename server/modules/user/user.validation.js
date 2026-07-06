import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100),
  email: Joi.string().email(),
}).min(1);

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(128).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({ 'string.pattern.base': 'Password must contain uppercase, lowercase, and number' }),
});
