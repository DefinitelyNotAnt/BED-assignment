const Joi = require("../node_modules/joi");

const validateUser = (req, res, next) => {
    const schema = Joi.object({
      LoginName: Joi.string().min(3).max(50).required(),
      PasswordHash: Joi.string().min(3).max(50).required(),
      Email: Joi.string().min(3).max(50),
      PasswordHash: Joi.string().min(8).max(50).required(),
      Access: Joi.string().min(1).max(1).required()
    });
  
    const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body
  
    if (validation.error) {
      const errors = validation.error.details.map((error) => error.message);
      res.status(400).json({ message: "Validation error", errors });
      return; // Terminate middleware execution on validation error
    }
  
    next(); // If validation passes, proceed to the next route handler
  };


module.exports = {
  validateUser
};