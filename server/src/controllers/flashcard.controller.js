import {
    createFlashcardService,
    getDeckFlashcards,
    getFlashcardsByDeckService,
    deleteFlashcard
} from '../services/flashcard.service.js';

export const createFlashcard = async (req, res) => {
    try {

        const flashcard =
            await createFlashcardService(
                req.body,
                req.params.deckId,
                req.user._id
            );

        res.status(201).json({
            success: true,
            flashcard
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAll = async (req, res) => {
    try {

        const flashcards =
            await getDeckFlashcards(
                req.params.deckId,
                req.user._id
            );

        res.status(200).json({
            success: true,
            flashcards
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getFlashcardsByDeck = async (req, res) => {
    try {

        const flashcards =
            await getFlashcardsByDeckService(
                req.params.deckId
            );

        res.status(200).json({
            success: true,
            flashcards
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const remove = async (req, res) => {
    try {

        const result =
            await deleteFlashcard(
                req.params.id,
                req.user._id
            );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

