import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("super_admin", "admin", "student").default("student"),
  university: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
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
