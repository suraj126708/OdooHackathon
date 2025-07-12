const joi = require("joi");

const signUpValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(2).max(100).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 100 characters",
      "any.required": "Name is required",
    }),
    email: joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    username: joi
      .string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username cannot exceed 30 characters",
        "string.pattern.base":
          "Username can only contain letters, numbers, and underscores",
        "any.required": "Username is required",
      }),
    password: joi.string().min(6).max(128).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "any.required": "Password is required",
    }),
    bio: joi.string().max(500).optional().messages({
      "string.max": "Bio cannot exceed 500 characters",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
      field: error.details[0].path[0],
    });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
      field: error.details[0].path[0],
    });
  }
  next();
};

const updateProfileValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(2).max(100).optional().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 100 characters",
    }),
    bio: joi.string().max(500).optional().messages({
      "string.max": "Bio cannot exceed 500 characters",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
      field: error.details[0].path[0],
    });
  }
  next();
};

module.exports = {
  signUpValidation,
  loginValidation,
  updateProfileValidation,
};
