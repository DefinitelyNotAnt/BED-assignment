const Joi = require("joi");

const validatePlaces = (req, res, next) => 
{
  const schema = Joi.object
  ({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).required(),
    operatinghours :  Joi.string().min(3).max(100).required(),
    address : Joi.string().min(3).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) 
  {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

////module.exports is a special object that allows you to export values (functions, variables, classes) from your module file to be used in other parts of your application.
module.exports = validatePlaces;