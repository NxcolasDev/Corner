import Deck from '../models/Deck.js';
import Flashcard from '../models/Flashcard.js';

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

export const updateDeck = async (deckId, userId, data) => {
    const deck = await Deck.findOne({
        _id: deckId,
        user: userId
    });

    if (!deck) {
        throw new Error('Deck not found');
    }

    deck.title = data.title ?? deck.title;
    deck.description = data.description ?? deck.description;

    await deck.save();
    return deck;
};

export const deleteDeck = async (deckId, userId) => {
    const deck = await Deck.findOne({
        _id: deckId,
        user: userId
    });

    if (!deck) {
        throw new Error('Deck not found');
    }

    await Flashcard.deleteMany({ deck: deckId });
    await deck.deleteOne();

    return {
        message: 'Deck deleted'
    };
};
