const Joi = require("../node_modules/joi");

const validateUser = (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(3).max(50),
      password: Joi.string().min(3).max(50).required(),
      confirmPassword: Joi.string().min(8).max(50).required()
    });
  
    const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body
  
    if (validation.error) {
      const errors = validation.error.details.map((error) => error.message);
      popupS.alert({
        mode: "alert",
        content: "Validation error"
      })
      res.status(400).json({ message: "Validation error", errors });
      return; // Terminate middleware execution on validation error
    }
  
    next(); // If validation passes, proceed to the next route handler
  };


module.exports = {
  validateUser
};