import {Router} from 'express';
import {body} from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';
const router = Router();

router.post('/create',
    authMiddleware.authUser,
    body('name').isString().withMessage('Name is required '),
    projectController.createProject
)

router.get('/all',
    authMiddleware.authUser,
    projectController.getAllProject
)

router.put('/add-user',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('ProjectId is required'),
    body('users').isArray().withMessage('Users must be an array'),
    body('users.*').isString().withMessage('Each user must be a string'),
    projectController.addUserToProject
)

router.get('/get-project/:projectId',
    authMiddleware.authUser,
    projectController.getProjectById
)

router.put('/update-file-tree',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('ProjectId is required'),
    body('fileTree').isObject().withMessage('FileTree is required'),
    projectController.updateFileTree
)

export default router;