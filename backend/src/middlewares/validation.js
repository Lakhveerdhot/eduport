import Joi from 'joi';

// Validation schemas
export const signupSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('student', 'teacher').required(),
  stream: Joi.string().when('role', {
    is: 'student',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const createCourseSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional(),
  subject: Joi.string().min(1).max(100).required(),
  stream: Joi.string().min(1).max(50).required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().greater(Joi.ref('startTime')).required()
});

export const attendanceSchema = Joi.object({
  date: Joi.date().iso().required(),
  attendances: Joi.array().items(
    Joi.object({
      studentId: Joi.number().integer().positive().required(),
      status: Joi.string().valid('PRESENT', 'ABSENT').required()
    })
  ).min(1).required()
});

export const enrollSchema = Joi.object({
  courseId: Joi.number().integer().positive().required()
});

// Middleware to validate request body
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: true, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // replace body with the validated/stripped value
    req.body = value;
    next();
  };
};
