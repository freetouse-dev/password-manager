import ApiResponse from '../shared/response.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        error.details.forEach((detail) => {
          errors.push({ field: detail.path.join('.'), message: detail.message });
        });
      }
    }

    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false });
      if (error) {
        error.details.forEach((detail) => {
          errors.push({ field: detail.path.join('.'), message: detail.message });
        });
      }
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        error.details.forEach((detail) => {
          errors.push({ field: detail.path.join('.'), message: detail.message });
        });
      }
    }

    if (errors.length > 0) {
      return ApiResponse.error(res, 'Validation failed', 400, errors);
    }

    next();
  };
};
