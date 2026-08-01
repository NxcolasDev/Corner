export const mapRatingToQuality = (rating) => {
    // Map string ratings to SM-2 quality (0-5)
    switch ((rating || '').toLowerCase()) {
        case 'again':
            return 2;
        case 'hard':
            return 3;
        case 'medium':
        case 'good':
            return 4;
        case 'easy':
            return 5;
        default:
            return 4; // default to 'good'
    }
}

export const calculateSM2Schedule = (flashcard, rating, now = new Date()) => {
    const q = mapRatingToQuality(rating);

    const prevInterval = Math.max(0, Number(flashcard?.intervalDays) || 0);
    const prevEF = Number(flashcard?.easeFactor) || 2.5;
    let ef = prevEF;
    let interval = prevInterval;
    let reviewCount = Number(flashcard?.reviewCount) || 0;

    if (q < 3) {
        // Failed recall: reset repetition
        reviewCount = 0;
        interval = 0;
        const next = new Date(now);
        next.setMinutes(next.getMinutes() + 5);
        return { nextReview: next, intervalDays: interval, easeFactor: ef, reviewCount };
    }

    // successful recall
    reviewCount += 1;

    if (reviewCount === 1) {
        interval = 1;
    } else if (reviewCount === 2) {
        interval = 6;
    } else {
        interval = Math.round(prevInterval * ef) || 1;
    }

    // update EF per SM-2
    ef = prevEF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    ef = Math.max(1.3, Number(ef.toFixed(2)));

    const next = new Date(now);
    next.setDate(next.getDate() + interval);

    // safety cap
    if (interval > 3650) interval = 3650;

    return { nextReview: next, intervalDays: interval, easeFactor: ef, reviewCount };
}

export default { mapRatingToQuality, calculateSM2Schedule };
