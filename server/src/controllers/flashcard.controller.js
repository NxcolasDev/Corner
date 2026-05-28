import {
    createFlashcard,
    getDeckFlashcards,
    deleteFlashcard
} from '../services/flashcard.service.js';

export const create = async (req, res) => {
    try {

        const flashcard =
            await createFlashcard(
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