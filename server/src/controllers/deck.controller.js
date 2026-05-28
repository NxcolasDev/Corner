import {
    createDeck,
    getUserDecks,
    deleteDeck
} from '../services/deck.service.js';

export const create = async (req, res) => {
    try {
        const deck = await createDeck(req.body, req.user._id);

        res.status(201).json({
            success: true,
            deck
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
        const decks = await getUserDecks(req.user._id);

        res.status(200).json({
            success: true,
            decks
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
        const result = await deleteDeck(
            req.params.id,
            req.user._id
        );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};