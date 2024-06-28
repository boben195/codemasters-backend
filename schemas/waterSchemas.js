import Joi from "joi";

const addWaterSchema = Joi.object({
  amount: Joi.number().min(50).max(12000).required(),
  year: Joi.number().less(2026).required().greater(2022),
  month: Joi.number()
    .less(12)
    .required()
    .greater(0 - 1),
  day: Joi.number().less(32).greater(0).required(),
  time: Joi.string()
    .pattern(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "HH:MM format - example '00:16'"
    )
    .required()
    .messages({
      "string.pattern.base":
        "Time must be in the format HH:MM - example '00:16'",
    }),
});

const editWaterSchema = Joi.object({
  id: Joi.string().length(24).required().messages({
    "string.length": '"userId" must be a valid 24-character ObjectId',
    "any.required": '"userId" is required',
  }),
  amount: Joi.number().min(50).max(12000).required(),
  time: Joi.string()
      .pattern(
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          "HH:MM format - example '00:16'"
      )
      .required()
      .messages({
        "string.pattern.base":
            "Time must be in the format HH:MM - example '00:16'",
      }),
});

const deleteWaterSchema = Joi.object({
  id: Joi.string().length(24).required().messages({
    "string.length": '"Id" must be a valid 24-character ObjectId',
    "any.required": '"Id" is required',
  }),
});

const getByDay = Joi.object({
  year: Joi.number().less(2026).required().greater(2022),
  month: Joi.number()
    .less(12)
    .required()
    .greater(0 - 1),
  day: Joi.number().less(32).greater(0).required(),
});

const getByMonth = Joi.object({
  year: Joi.number().less(2026).required().greater(2022),
  month: Joi.number()
    .less(12)
    .required()
    .greater(0 - 1),
});

const waterValidationSchemas = {
  addWaterSchema,
  editWaterSchema,
  deleteWaterSchema,
  getByDay,
  getByMonth,
};

export default waterValidationSchemas;
