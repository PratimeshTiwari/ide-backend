import express from 'express';
import File from '../models/File.js';
import Project from '../models/Project.js';
import {authenticate} from '../middleware/auth.js';
import * as fileController from '../controllers/fileController.js';
const router = express.Router();

router.post('/files',authenticate,fileController.addFiles);
router.get('/files/:id',authenticate,fileController.getFiles);
router.put('/files/:id',authenticate,fileController.updateFiles);
router.delete('/files/:id',authenticate,fileController.deleteFiles);

export default router;