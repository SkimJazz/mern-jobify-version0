// Library imports
import { Router } from 'express';
const router = Router();
import { logout } from '../controllers/authController.js';
import rateLimiter from 'express-rate-limit';

// Local imports
import { register, login } from '../controllers/authController.js';
import { validateRegisterInput } from '../middleware/validationMiddleware.js';
import { validateLoginInput } from '../middleware/validationMiddleware.js';



const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,
    message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' },
});

// Routes
router.post('/register', apiLimiter ,validateRegisterInput, register);
router.post('/login', apiLimiter ,validateLoginInput, login);
router.get('/logout', logout);

// Export the router
export default router;