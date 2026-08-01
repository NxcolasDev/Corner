import express from 'express';
import protect from '../middleware/auth.middleware.js';
import {
  getMe,
  updateSettings,
  recordStudySession,
  getDashboardStats
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/dashboard', protect, getDashboardStats);
router.put('/settings', protect, updateSettings);
router.post('/study-session', protect, recordStudySession);

export default router;