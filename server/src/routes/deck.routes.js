import express from 'express';

import protect from '../middleware/auth.middleware.js';

import {
    create,
    getAll,
    remove,
    update
} from '../controllers/deck.controller.js';

const router = express.Router();

router.post('/', protect, create);
router.get('/', protect, getAll);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

export default router;