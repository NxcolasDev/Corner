import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ''
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        totalCards: {
            type: Number,
            default: 0
        },

        lastStudied: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Deck = mongoose.model('Deck', deckSchema);

export default Deck;