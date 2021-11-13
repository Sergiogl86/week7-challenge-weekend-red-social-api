const { Joi } = require("express-validation");

const userValidation = {
  body: Joi.object({
    username: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    age: Joi.number().max(130).min(16).required(),
    bio: Joi.string()
      .regex(/[a-zA-Z0-9]{3,100}/)
      .required(),
  }),
};

module.exports = userValidation;
