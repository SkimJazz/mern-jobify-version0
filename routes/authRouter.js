// Library imports
import { Router } from 'express';
const router = Router();
import { logout } from '../controllers/authController.js';

// Local imports
import { register, login } from '../controllers/authController.js';
import { validateRegisterInput } from '../middleware/validationMiddleware.js';
import { validateLoginInput } from '../middleware/validationMiddleware.js';


// Routes
router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
router.get('/logout', logout);

// Export the router
export default router;