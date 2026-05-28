import express from 'express';
import protect from '../middleware/auth.middleware.js';

import {
    createFlashcard,
    getFlashcardsByDeck,
    remove
} from '../controllers/flashcard.controller.js';

const router = express.Router();

router.post(
    '/:deckId',
    protect,
    createFlashcard
);

router.get(
    '/:deckId',
    protect,
    getFlashcardsByDeck
);


router.delete(
    '/:id',
    protect,
    remove
);


export default router;
