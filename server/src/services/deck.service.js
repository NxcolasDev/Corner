import Deck from '../models/Deck.js';

export const createDeck = async (data, userId) => {
    const deck = await Deck.create({
        ...data,
        user: userId
    });

    return deck;
};

export const getUserDecks = async (userId) => {
    return await Deck.find({ user: userId }).sort({
        createdAt: -1
    });
};

export const deleteDeck = async (deckId, userId) => {
    const deck = await Deck.findOne({
        _id: deckId,
        user: userId
    });

    if (!deck) {
        throw new Error('Deck not found');
    }

    await deck.deleteOne();

    return {
        message: 'Deck deleted'
    };
};