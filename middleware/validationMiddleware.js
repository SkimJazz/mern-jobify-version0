// Library imports
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Local imports
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import Job from '../models/JobModel.js';
import User from '../models/UserModel.js';



/**
 * A higher-order function that takes an array of validation checks and
 * returns an array of middleware functions. The first function in the
 * returned array performs the validation checks. The second function
 * checks if there are any validation errors. If there are errors, it
 * throws a BadRequestError with the error messages. If there are no
 * errors, it calls the next middleware function.
 *
 * So for EVERY CONTROLLER that needs validation, we will invoke the
 * withValidationErrors function and pass in the validateValues array
 * containing the values we want to validate.
 *
 * @param {Array} validateValues - An array of validation checks.
 * @returns {Array} An array of middleware functions.
 */
const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            // console.log(errors.isEmpty())
            if (!errors.isEmpty()) {

                const errorMessages = errors.array().map((error) => error.msg);

                if (errorMessages[0].startsWith('no job')) {
                    throw new NotFoundError(errorMessages);
                }
                if (errorMessages[0].startsWith('not authorized')) {
                    throw new UnauthorizedError('not authorized to access this route');
                }
                throw new BadRequestError(errorMessages);
            }
            next(); // Pass on to the next middleware
        },

    ];
};


// Exported to jobRouter.js file
export const validateJobInput = withValidationErrors([
    body('company').notEmpty().withMessage('company is required'),
    body('position').notEmpty().withMessage('position is required'),
    body('jobLocation').notEmpty().withMessage('job location is required'),
    body('jobStatus')
        // object.values (BUILT IN TO JS) returns an array of values of the JOB_STATUS object
        .isIn(Object.values(JOB_STATUS))
        .withMessage('invalid status value'),

    body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('invalid job type'),
]);


// Exported to jobRouter.js file
export const validateIdParam = withValidationErrors([
    param('id').custom(async(value, { req }) => {

        const isValidIdMongoId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidIdMongoId) throw new BadRequestError('invalid MongoDB id');

        const job = await Job.findById(value);
        if (!job) throw new NotFoundError(`no job with id : ${value}`);

        // Check if user making request is an Admin
        const isAdmin = req.user.role === 'admin';
        // Check if user is the creator of the job
        const isOwner = req.user.userId === job.createdBy.toString();
        // If user is not an Admin and is not the creator of the job
        if (!isAdmin && !isOwner)
            // This error message must be the same as the one in the withValidationErrors function
            // or it will not display the 403 Unauthorized error message
            throw new UnauthorizedError('not authorized to access this route');

    }),
]);

// Exported to authRouter.js file
export const validateRegisterInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invalid email format')

        // Remember! async functions don't return TRUE or FALSE but instead return a promise.
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new BadRequestError('email already exists');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters long'),
    body('location').notEmpty().withMessage('location is required'),
    body('lastName').notEmpty().withMessage('last name is required'),
]);


/**
 * Middleware function for validating login input.
 * This function is exported to the `authRouter.js` file.
 * It uses the `withValidationErrors` higher-order function to perform
 * validation checks on the login input.
 * The validation checks are performed on the 'email' and 'password'
 * fields of the request body.
 *
 * @module validateLoginInput
 * @function
 * @param {Object} req - Request object, containing 'email' and 'password' fields in req.body.
 * @param {string} req.body.email - Email provided by user.
 * @param {string} req.body.password - Password provided by user.
 * @returns {Array} An array of middleware functions. The first function performs the validation checks. The second function checks if there are any validation errors and throws a BadRequestError with the error messages if there are. If there are no errors, it calls the next middleware function.
 * @throws {BadRequestError} If the 'email' or 'password' fields are empty or if the 'email' field is not in a valid email format.
 *
 * @example
 * // POST /api/login
 * {
 *   "email": "exampleUser@example.com",
 *   "password": "examplePassword"
 * }
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the 'email' field is not empty and is in a valid email format.
 * 2. Checks if the 'password' field is not empty.
 * 3. If there are any validation errors, it throws a BadRequestError with the error messages.
 * 4. If there are no errors, it calls the next middleware function.
 */
export const validateLoginInput = withValidationErrors([
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invalid email format'),

    body('password')
        .notEmpty()
        .withMessage('password is required'),
]);


export const validateUpdateUserInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invalid email format')
        .custom(async (email, { req }) => {

            // Check if email already exists in the database
            const user = await User.findOne({ email });
            // If email exists and the user is not the same user making the request
            if (user && user._id.toString() !== req.user.userId) {
                throw new Error('email already exists');
            }
        }),
    body('lastName').notEmpty().withMessage('last name is required'),
    body('location').notEmpty().withMessage('location is required'),
]);