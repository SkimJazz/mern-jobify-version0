/**
 * @file server.js
 * @version 0
 *
 * @description This file sets up the server for the application, including middleware, routes, and error handling.
 * It uses express.js as the web application framework and mongoose for handling MongoDB operations.
 * The server listens on a port defined in the environment variables or defaults to 4000.
 *
 * The file structure is as follows:
 * - Import necessary modules and routers
 * - Set up middleware
 * - Define routes
 * - Set up error handling
 * - Connect to MongoDB and start the server
 *
 * @requires express
 * @requires express-async-errors
 * @requires dotenv
 * @requires morgan
 * @requires mongoose
 * @requires cookie-parser
 * @requires ./routes/jobRouter.js
 * @requires ./routes/authRouter.js
 * @requires ./routes/userRouter.js
 * @requires ./middleware/errorHandlerMiddleware.js
 * @requires ./middleware/authMiddleware.js
 */
// Library imports
import 'express-async-errors';  // express-async-errors MUST BE AT TOP OF ALL OTHER IMPORTS!!!
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import morgan from "morgan";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// ROUTER IMPORTS
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from './routes/userRouter.js';

// PUBLIC IMPORTS
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// MIDDLEWARE IMPORTS
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';



// -------------------------- CLOUDINARY CONFIG ---------------------- //

/**
 * Configures the Cloudinary service.
 *
 * Cloudinary was chosen as the image and video management solution for this
 * project. First choice was Render.com, but Render does not support persistent
 * image storage on the free web service.
 *
 * It is configured using three environment variables:
 * - CLOUD_NAME: The name of your cloud as provided by Cloudinary.
 * - CLOUD_API_KEY: The API key provided by Cloudinary for your account.
 * - CLOUD_API_SECRET: The API secret key provided by Cloudinary for your account.
 *
 * Values should be stored in .env file (ref .env.example) for security and configuration
 * management.
 */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});



// -------------------------- GLOBAL VARIABLES ---------------------- //

/**
 * @description This line of code is used to get the directory name of the
 * current module when using ES modules in Node.js. In Node.js, `__dirname`
 * is a global variable that provides the directory path of the current
 * module. However, this variable is not available when using ES modules.
 *
 * To get the directory name when using ES modules, Node.js provides the
 * `import.meta.url` property. This property returns a URL string that
 * represents the URL of the current module. The `fileURLToPath()` function
 * from the 'url' module is used to convert this URL string into a file path
 * string.
 *
 * Finally, the `dirname()` function from the 'path' module is used to get
 * the directory name from this file path string. This directory name is
 * equivalent to `__dirname` in a CommonJS module. So, this line of code
 * essentially recreates the `__dirname` functionality for ES modules.
 *
 * @example Using __dirname with ES modules
 * app.use(express.static(path.resolve(__dirname, './public')));
 */
const __dirname = dirname(fileURLToPath(import.meta.url));



// -------------------------- MIDDLEWARE --------------------------- //

/**
 * @description Middleware for morgan logging wrapped in a condition to
 * only run in development environment. If this is === production, morgan
 * will not show the logs in the terminal
 */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * @description This line of code is used to serve static files from the
 * 'public' directory in an Express.js application. The `express.static`
 * function is a built-in middleware function in Express.js for serving
 * static files. It takes the path to the directory from which to serve
 * static files as an argument.
 *
 * Here, `path.resolve(__dirname, './public')` is used to get the absolute
 * path to the 'public' directory. The `__dirname` is a global variable in
 * Node.js that gives the directory of the current module. So,
 * `path.resolve(__dirname, './public')` gives the absolute path to the
 * 'public' directory in the project.
 *
 * This line of code is related to the `__dirname` global variable as it uses
 * `__dirname` to construct the path to the 'public' directory.
 *
 * @example Using __dirname to get the directory name of the current module
 * const __dirname = dirname(fileURLToPath(import.meta.url));
 */
// app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.static(path.resolve(__dirname, './client/dist')));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for parsing JSON data
app.use(express.json());

//
app.use(helmet());
app.use(mongoSanitize());



// -------------------------- ROUTES ------------------------------- //



// GET request controller request, response
app.get('/', (req, res) => {
    res.send('ExpressJS is synced');
});

// Mounting authRouter on the '/api/v0/auth' route
app.use('/api/v0/auth', authRouter);

// Mounting jobRouter on the '/api/v0/jobs' route
app.use('/api/v0/jobs', authenticateUser, jobRouter);

app.use('/api/v0/users', authenticateUser, userRouter);


// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './public', 'index.html'));
// });


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});


// -------------------------- ERROR HANDLING ----------------------- //

/**
 * Middleware for handling 404 errors (Not Found Middleware)
 * This middleware is used when no routes match the incoming request
 * or rather when the request doesn't match anything in our server.
 * It sends a 404 status code and a JSON response with a message 'not found'.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.use('*', (req, res) => {
    res.status(404).json({ msg: 'resource not found' });
});


/**
 * WARNING!! Mount the errorHandlerMiddleware function BEFORE the 500 error
 * middleware or the 'throw new NotFoundError' in jobController.js will not
 * work, as the error will not be caught by the customError.js or
 * errorHandlerMiddleware.js middleware functions.
*/
app.use(errorHandlerMiddleware);


/**
 * Middleware for handling 500 errors (Internal Server Error Middleware).
 * Used to catch any errors that occur during the execution of route
 * handlers or other middleware. It's triggered by our existing controllers,
 * effectively showcasing an error upon a valid request when we try to
 * implement the functionality.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ msg: 'internal server error' });
});



// -------------------------- SERVER CONNECTION --------------------- //

// Ears on my local port 3000 with port 4000 as backup
const port = process.env.PORT || 4000;

/**
 * This block of code is responsible for connecting to the MongoDB database and
 * starting the server. It uses a try-catch block to handle any potential errors
 * that might occur during these operations.
 *
 * @async
 * @function
 * @description Tries to establish a connection with the MongoDB database using
 * the connection string from the environment variables. If the connection is
 * successful, it starts the server on the specified port. If an error occurs
 * during these operations, it logs the error and terminates the process with
 * a failure status code (1).
 */
try {
    // Attempt to connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URL);
    // If the connection is successful, start the server
    app.listen(port, () => {
        console.log(`server running on PORT ${port}....`);
    });
} catch (error) {
    // If error occurs, log error and terminate process with a failure status code
    console.log(error);
    process.exit(1);
}


/**
 * WARNING!! DIRECT Server conflict for the 'app.listen' function
 *
 * @throws {Error} This error can occur if the server is already running.
 * The following 'app.listen' function is in direct conflict with the 'try-catch'
 * block that starts the server (above code block) The 'try-catch' block starts
 * the server if the connection to the MongoDB database is successful. If the
 * server is already running, the 'app.listen' function will throw an error since
 * the server is already running on the specified port.
 *
 * @param {number} port - The port number on which the server should
 * listen.
 */
// app.listen(port, () => {
//     console.log(`server running on PORT ${port}....`);
// });