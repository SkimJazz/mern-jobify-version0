import {Router} from "express";
import { validateJobInput, validateIdParam } from '../middleware/validationMiddleware.js';


// ES6 modules
const router = Router();

import {
    getAllJobs,
    getJobById,
    createNewJob,
    updateJobById,
    deleteJobById,
    showStats,
} from '../controllers/jobController.js';
import {checkForTestUser} from "../middleware/authMiddleware.js";



router
    .route('/')
    .get(getAllJobs)
    .post(checkForTestUser, validateJobInput, createNewJob);

// IMPORTANT: Stats must be placed before the '/:id' route
// or express will treat 'stats' as an id. Express reads top to bottom
router.route('/stats').get(showStats);


router
    .route('/:id')
    .get(validateIdParam , getJobById)
    .patch(checkForTestUser, validateJobInput, validateIdParam, updateJobById)
    .delete(checkForTestUser, validateIdParam, deleteJobById);


export default router;