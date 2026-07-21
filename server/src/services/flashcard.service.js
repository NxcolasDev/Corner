import Flashcard from '../models/Flashcard.js';
import Deck from '../models/Deck.js';
import { calculateSM2Schedule } from './srs.service.js';

export const createFlashcardService = async (
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
    }).sort({
        nextReview: 1,
        createdAt: -1
    });
};

export const updateFlashcardService = async (
    flashcardId,
    userId,
    data
) => {
    const flashcard = await Flashcard.findById(flashcardId);

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

    flashcard.front = data.front ?? flashcard.front;
    flashcard.back = data.back ?? flashcard.back;
    flashcard.difficulty = data.difficulty ?? flashcard.difficulty;
    flashcard.tags = data.tags ?? flashcard.tags;

    // If client provided a rating, compute schedule server-side (SM-2) and apply
    if (data.rating) {
        const schedule = calculateSM2Schedule(flashcard, data.rating, new Date());
        flashcard.nextReview = schedule.nextReview;
        flashcard.intervalDays = schedule.intervalDays;
        flashcard.easeFactor = schedule.easeFactor;
        flashcard.reviewCount = schedule.reviewCount;
    } else {
        flashcard.nextReview = data.nextReview ?? flashcard.nextReview;
        flashcard.intervalDays = data.intervalDays ?? flashcard.intervalDays;
        flashcard.easeFactor = data.easeFactor ?? flashcard.easeFactor;
        flashcard.reviewCount = data.reviewCount ?? flashcard.reviewCount;
    }

    await flashcard.save();

    if (data.rating || data.nextReview || data.reviewCount) {
        deck.lastStudied = new Date();
        await deck.save();
    }

    return flashcard;
};

export const deleteFlashcard = async (
    flashcardId,
    userId
) => {
    const flashcard = await Flashcard.findById(flashcardId);

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
