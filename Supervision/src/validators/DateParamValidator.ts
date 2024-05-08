import Joi from "joi";

const DateValidator = Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required()

export default DateValidator