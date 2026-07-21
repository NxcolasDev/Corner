import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema(
    {
        front: {
            type: String,
            required: true,
            trim: true
        },

        back: {
            type: String,
            required: true,
            trim: true
        },

        tags: {
            type: [String],
            default: []
        },

        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },

        deck: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Deck',
            required: true
        },

        nextReview: {
            type: Date,
            default: Date.now
        },

        intervalDays: {
            type: Number,
            default: 0
        },

        easeFactor: {
            type: Number,
            default: 2.5
        },

        reviewCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Flashcard = mongoose.model(
    'Flashcard',
    flashcardSchema
);

export default Flashcard;
