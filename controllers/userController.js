// External imports
import { StatusCodes } from 'http-status-codes';
import cloudinary from 'cloudinary';


// Local imports
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js';
import { formatImage } from '../middleware/multerMiddleware.js';



// GET CURRENT USER -> This will run everytime the user navigates to the dashboard
export const getCurrentUser = async (req, res) => {
    // Look for a user whose ID matches the ID in the req.user.userId Ref: createJWT in authController.js
    const user = await User.findOne({ _id: req.user.userId });
    const userWithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};


// UPDATE CURRENT USER
export const updateUser = async (req, res) => {
    // console.log(req.file);
    const newUser = {...req.body};
    delete newUser.password;

    // Check BUT only if user is sending image
    if (req.file) {

        const file = formatImage(req.file);
        // return

        // Cloudinary version 2(v2) Node.js SDK being used -> last update April 22nd 2024
        const response = await cloudinary.v2.uploader.upload(file);

        // Add image to newUser object
        newUser.avatar = response.secure_url;
        // Add image public id to newUser object
        newUser.avatarPublicId = response.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);
    // If request file exists and updatedUser has avatarPublicId, delete the previous image from cloudinary
    if (req.file && updatedUser.avatarPublicId) {
        await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
    }
    res.status(StatusCodes.OK).json({ msg: 'update user' });
};


// GET JOB STATISTICS -> Admin only route
export const getApplicationStats = async (req, res) => {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    res.status(StatusCodes.OK).json({ users, jobs });
};

