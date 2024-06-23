
// External imports
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';

// Local imports
import User from '../models/UserModel.js';
import {comparePassword, hashPassword} from '../utils/passwordUtils.js';
import {UnauthenticatedError} from "../errors/customErrors.js";
import {createJWT} from "../utils/tokenUtils.js";
import { verifyJWT } from "../utils/tokenUtils.js";


/**
 * User registration controller
 *
 * Asynchronous function to register a new user.
 *
 * @module register
 * @param {Object} req - Request object, containing user details in req.body.
 * @param {string} req.body.password - Password provided by the user.
 * @param {Object} res - Response object.
 * @returns {Promise} Promise that resolves to a server response indicating the user registration status.
 *
 * @example
 * // POST /api/register
 * {
 *   "username": "exampleUser",
 *   "password": "examplePassword"
 * }
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the new account is the first account in the system.
 * 2. Assigns a role to the new user ('admin' for the first account, 'user' for subsequent accounts).
 * 3. Hashes the user's password for security.
 * 4. Creates a new user in the database with the provided details.
 * 5. Sends a response back to the client indicating successful user creation.
 */
export const register = async (req, res) => {
    const isFirstAccount = (await User.countDocuments()) === 0;
    req.body.role = isFirstAccount ? 'admin' : 'user';

    // Async Hash the password before saving it to the database
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: 'user created' });
    // res.send('register'); // Test to check if route is working
};


// User login controller using async/await ready for export
export const login = async (req, res) => {

    // Check if the user exists in the database
    const user = await User.findOne({ email: req.body.email });
    // If the user does not exist, throw new UnauthenticatedError from customErrors.js
    if (!user) throw new UnauthenticatedError('invalid credentials');

    /**
     * If User exists, then check provided password is correct.
     * Used in `login` function exported to `authRouter.js`.
     * It uses the `comparePassword` function from `passwordUtils.js` to
     * compare the provided password with the hashed password stored in
     * the database.
     *
     * @async
     * @function
     * @param {string} req.body.password - Password provided by the user.
     * @param {string} user.password - Hashed password stored in database.
     * @returns {boolean} Returns true if password matches hashed password, false otherwise.
     * @throws {UnauthenticatedError} If password does not match hashed password, an UnauthenticatedError is thrown with the message 'invalid credentials'.
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
     * 1. Calls the `comparePassword` function from `passwordUtils.js`
     *    with the provided password and the hashed password as arguments.
     * 2. If password matches the hashed password, it returns true.
     * 3. If password does not match the hashed password, it throws an
     *    UnauthenticatedError from `customErrors.js` as a 401 but using
     *    the message from this function 'invalid credentials'.
     *
     * @link {comparePassword} {@link file://passwordUtils.js}
     */
    const isPasswordCorrect = await comparePassword(
        // request located in the JSON body, and were looking for the password
        req.body.password,
        user.password
    );
    if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials');

    // ONELINER: for the above two if statements. Checks for both user and password
    // const isValidUser = user && (await comparePassword(password, user.password));
    // if (!isValidUser) throw new UnauthenticatedError('invalid credentials');


    const token = createJWT({ userId: user._id, role: user.role });
    // console.log(token);

    // Ref .env file for JWT_EXPIRES_IN value (1d)
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('monster', token, {
        httpOnly: true, // Cannot access the cookie using JavaScript
        expires: new Date(Date.now() + oneDay),

        // For https, if in production env then the secure property is set to true
        // if not then can still access it using the http protocol
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(StatusCodes.CREATED).json({ msg: 'user logged in' });
    // res.send('login route');
    // res.json({ token });
};

export const logout = async (req, res) => {

    const { monster } = req.cookies;
    if (!monster) {
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'No user is currently logged in' });
        return;
    }

    const { userId } = verifyJWT(monster);
    const user = await User.findById(userId);

    res.cookie('monster', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
        // secure: process.env.NODE_ENV === 'production',
    });
    res.status(StatusCodes.OK).json({ msg: `You are now logged out ${user.name}` });
}
