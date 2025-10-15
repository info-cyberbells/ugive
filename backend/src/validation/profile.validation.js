import Joi from "joi";

export const validateUpdateProfile = (data, role) => {
  let schema;

  switch (role) {
    case "student":
      schema = Joi.object({
        name: Joi.string().max(191).optional(),
        phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
        university: Joi.string().optional(),
        studentUniId: Joi.string().optional(),
      });
      break;

    case "admin":
      schema = Joi.object({
        name: Joi.string().max(191).optional(),
        phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
        university: Joi.string(),
      });
      break;

    case "super_admin":
      schema = Joi.object({
        name: Joi.string().max(191).optional(),
        phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
      });
      break;

    default:
      schema = Joi.object({});
  }

  return schema.validate(data);
};
