import Joi from 'joi';

export const createPasswordSchema = Joi.object({
  siteName: Joi.string().required().max(200),
  siteUrl: Joi.string().uri().optional().allow(''),
  username: Joi.string().required().max(200),
  password: Joi.string().required().max(500),
  category: Joi.string().max(100).optional(),
  notes: Joi.string().max(1000).optional().allow(''),
});

export const updatePasswordSchema = Joi.object({
  siteName: Joi.string().max(200),
  siteUrl: Joi.string().uri().optional().allow(''),
  username: Joi.string().max(200),
  password: Joi.string().max(500),
  category: Joi.string().max(100),
  notes: Joi.string().max(1000).optional().allow(''),
}).min(1);
