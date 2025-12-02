import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("super_admin", "admin", "student").default("student"),
  university: Joi.string().required(),
  college: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^04\s?\d{4}\s?\d{3}\s?\d{3}$/).required(),
  studentUniId: Joi.string(),
});

export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message).join(", "),
    });
  }
  next();
};
