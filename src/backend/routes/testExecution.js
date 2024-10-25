import express from 'express';
import { executeTest } from '../controllers/testExecutionController.js';

const router = express.Router();

router.post('/:projectId', executeTest);

export default router;
