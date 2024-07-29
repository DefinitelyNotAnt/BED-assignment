const Joi = require("../node_modules/joi");

const validateUser = (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().min(3).max(50).required(),
      password: Joi.string().min(8).max(50).required(),
    });
    const validation = schema.validate(req.body, { abortEarly: true }); // Validate request body
    console.log("Check finished");
    if (validation.error) {
      const errors = validation.error.details.map((error) => error.message);
      res.status(400).json({ message: "Validation error", errors });
      return null; // Terminate middleware execution on validation error
    }
    
    next(); // If validation passes, proceed to the next route handler
  };

  
const validateCreateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(8).max(50).required(),
    confirmPassword: Joi.string().min(8).max(50).required(),
    email: Joi.string().min(3).email()
  });
  const validation = schema.validate(req.body, { abortEarly: true }); // Validate request body
    console.log("Check finished");
    console.log(validation);
    if (validation.error) {
      const errors = validation.error.details.map((error) => error.message);
      res.status(400).json({ message: "Validation error", errors });
      return null; // Terminate middleware execution on validation error
    }
    
    next(); // If validation passes, proceed to the next route handler
}
const validateUpdateUser = (req, res, next) => {
  const schema = Joi.object({
    userid: Joi.required(),
    newUserData: {
      username: Joi.string().min(3).max(50).required(),
      password: Joi.string().min(8).max(50).required(),
      confirmPassword: Joi.string().min(8).max(50).required(),
      email: Joi.string().min(3).email()
    },
    oldPassword: Joi.string().min(8).required()
  });
  const validation = schema.validate(req.body, { abortEarly: true }); // Validate request body
    console.log("Check finished");
    console.log(validation);
    if (validation.error) {
      const errors = validation.error.details.map((error) => error.message);
      res.status(400).json({ message: "Validation error", errors });
      return null; // Terminate middleware execution on validation error
    }
    
    next(); // If validation passes, proceed to the next route handler
}

module.exports = {
  validateUser,
  validateCreateUser,
  validateUpdateUser
}