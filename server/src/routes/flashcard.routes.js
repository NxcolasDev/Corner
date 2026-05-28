import express from 'express';

import protect from '../middleware/auth.middleware.js';

import {
    create,
    getAll,
    remove
} from '../controllers/flashcard.controller.js';

const router = express.Router();

router.post(
    '/:deckId',
    protect,
    create
);

router.get(
    '/:deckId',
    protect,
    getAll
);

router.delete(
    '/:id',
    protect,
    remove
);

export default router;