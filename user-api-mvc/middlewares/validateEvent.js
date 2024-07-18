const Joi = require("joi");

const validateEvent = (req, res, next) => {
  const schema = Joi.object({
    EventName: Joi.string().min(3).max(50).required(),
    EventDesc: Joi.string().min(3).max(800).required(),
    EventStartTime: Joi.date().iso().required(),
    EventEndTime: Joi.date().iso().required(),
    EntryPrice: Joi.number().min(0).required(),
    HostID: Joi.number().min(1).required(),
  });
console.log(req.body);
  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateEvent;