import { describe, it, expect } from 'vitest';
import { calculateSM2Schedule, mapRatingToQuality } from '../src/services/srs.service.js';

describe('SM-2 schedule', () => {
    it('maps ratings to quality', () => {
        expect(mapRatingToQuality('again')).toBe(2);
        expect(mapRatingToQuality('hard')).toBe(3);
        expect(mapRatingToQuality('medium')).toBe(4);
        expect(mapRatingToQuality('easy')).toBe(5);
    });

    it('resets on low quality', () => {
        const card = { intervalDays: 10, easeFactor: 2.5, reviewCount: 3 };
        const res = calculateSM2Schedule(card, 'again', new Date('2026-01-01T00:00:00Z'));
        expect(res.intervalDays).toBe(0);
        expect(res.reviewCount).toBe(0);
        expect(res.nextReview.getMinutes()).toBe(5);
    });

    it('increases interval on repeated success', () => {
        const card = { intervalDays: 6, easeFactor: 2.5, reviewCount: 2 };
        const res = calculateSM2Schedule(card, 'good', new Date('2026-01-01T00:00:00Z'));
        expect(res.intervalDays).toBe(15);
        expect(res.easeFactor).toBeGreaterThanOrEqual(1.3);
        expect(res.nextReview.getDate()).toBe(15); // 1 Jan + 15 days
    });
});
