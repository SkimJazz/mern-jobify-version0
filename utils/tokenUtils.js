// External packages from libraries
import jwt from 'jsonwebtoken';


// export const createJWT = (payload) => {
//     const token = jwt.sign(payload, 'secret', {
//         expiresIn: '1d',
//     });
//     return token;
// };

// The JWT does not get decoded on the frontend, but rather will be sent to the
// frontend and then sent back with every request to the server since the JWT
// is stored in the cookie. The server will then decode the JWT and verify
// the user's identity.
export const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
};


export const verifyJWT = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
};