import Flashcard from '../models/Flashcard.js';
import Deck from '../models/Deck.js';

export const createFlashcard = async (
    data,
    deckId,
    userId
) => {

    const deck = await Deck.findOne({
        _id: deckId,
        user: userId
    });

    if (!deck) {
        throw new Error('Deck not found');
    }

    const flashcard = await Flashcard.create({
        ...data,
        deck: deckId
    });

    deck.totalCards += 1;

    await deck.save();

    return flashcard;
};

export const getDeckFlashcards = async (
    deckId,
    userId
) => {

    const deck = await Deck.findOne({
        _id: deckId,
        user: userId
    });

    if (!deck) {
        throw new Error('Deck not found');
    }

    return await Flashcard.find({
        deck: deckId
    });
};

export const deleteFlashcard = async (
    flashcardId,
    userId
) => {

    const flashcard = await Flashcard.findById(
        flashcardId
    );

    if (!flashcard) {
        throw new Error('Flashcard not found');
    }

    const deck = await Deck.findOne({
        _id: flashcard.deck,
        user: userId
    });

    if (!deck) {
        throw new Error('Unauthorized');
    }

    await flashcard.deleteOne();

    deck.totalCards -= 1;

    await deck.save();

    return {
        message: 'Flashcard deleted'
    };
};