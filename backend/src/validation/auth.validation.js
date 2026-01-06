import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("super_admin", "admin", "student").default("student"),
  university: Joi.string().required(),
  college: Joi.string().optional().allow("", null),
  phoneNumber: Joi.string()
    .pattern(/^04\d{2}\s\d{3}\s\d{3}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid phone number format",
      "string.empty": "Phone number is required"
    }),
  studentUniId: Joi.string(),
  colleges: Joi.alternatives().try(
    Joi.array().items(Joi.string().hex().length(24)),
    Joi.string()
  ).optional(),
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
