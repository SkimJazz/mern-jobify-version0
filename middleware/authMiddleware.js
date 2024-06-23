
// Local imports
import { UnauthenticatedError, UnauthorizedError } from '../errors/customErrors.js';
import {verifyJWT} from "../utils/tokenUtils.js";


// Demo test user check
export const checkForTestUser = (req, res, next) => {
    if (req.user.testUser) {
        throw new UnauthorizedError('Demo User. Read Only!');
    }
    next();
};


// async removed form this function -> added to the verifyJWT function
export const authenticateUser = (req, res, next) => {
    const { monster } = req.cookies;
    if (!monster) {
        throw new UnauthenticatedError('authentication invalid');
    }

    try {
        const { userId, role } = verifyJWT(monster);
        const testUser = userId === '6673902fd8c5cf231e36d134';
        req.user = { userId, role, testUser };
        next();
    } catch (error) {
        throw new UnauthenticatedError('authentication JWT is invalid');
    }
};


// Application Stats -> authorize users based on their role (Only Admin)
export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};

// Terminal test of the above function for role based permissions
// export const authorizePermissions = (...rest) => {
//     return (req, res, next) => {
//         console.log(rest);
//         next();
//     }
// };