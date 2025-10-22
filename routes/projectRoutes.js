import express from 'express';
import Project from '../models/Project.js';
import {authenticate} from '../middleware/auth.js';
import * as projectController from '../controllers/projectController.js';
const router = express.Router();

router.post('/projects', authenticate,projectController.addProject);
router.get('/projects/user/:userId', authenticate,projectController.getProjectByUserID);
router.get('/projects/:id', authenticate,projectController.getProjectByID);
router.put('/projects/:id', authenticate,projectController.updateProjectByID);
router.delete('/projects/:id', authenticate, projectController.deleteProjectByID);

export default router;