import { Router } from 'express';
const router = Router();


// Local imports
import {
    getCurrentUser,
    getApplicationStats,
    updateUser,
} from '../controllers/userController.js';
import {validateUpdateUserInput} from "../middleware/validationMiddleware.js";
import {authorizePermissions, checkForTestUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";


// Get current user profile details including avatar image
router.get('/current-user', getCurrentUser);

// Get application stats for admin dashboard
router.get('/admin/app-stats', [
    authorizePermissions('admin'),
    getApplicationStats,
]);


// Update user profile including avatar image
router.patch('/update-user',
    checkForTestUser,
    upload.single('avatar'),
    validateUpdateUserInput,
    updateUser
);


export default router;
