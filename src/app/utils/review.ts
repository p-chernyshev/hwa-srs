import { Card } from '../types/card';
import { CardProgress, CardStatus } from '../types/card-progress';
import { NewCardReview } from '../types/card-review';

function lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
}

class Review {
    public static readonly initialIntervalMilliseconds = 24 * 60 * 60 * 1000;
    public static readonly completedIntervalMilliseconds = 2 * 365 * 24 * 60 * 60 * 1000;

    public static getUpdatedCardProgress(card: Card, cardReview: NewCardReview): CardProgress {
        if (card.cardType.readOnce) {
            return this.getCardProgressForReadOnce(card);
        } else if (!card.progress || !card.progress.interval || !card.progress.dueDate || card.progress.status !== CardStatus.Reviewing) {
            return this.getCardProgressForFirstReview(card);
        } else {
            const newInterval = this.calculateInterval(card.progress.interval, cardReview.answer);
            return newInterval > this.completedIntervalMilliseconds
                ? this.getCardProgressForCompleted(card)
                : this.getCardProgressForNextReview(card, newInterval);
        }
    }

    private static calculateInterval(interval: number, answer: number): number {
        const intervalReset = this.initialIntervalMilliseconds;
        const intervalRepeat = interval;
        const intervalNormal = interval * 2;
        const intervalGood = interval * 3;

        if (answer <= 2) return lerp(intervalReset, intervalRepeat, answer / 2);
        if (answer <= 5) return lerp(intervalRepeat, intervalNormal, (answer - 2) / (5 - 2));
        return lerp(intervalNormal, intervalGood, (answer - 5) / (10 - 5));
    }

    private static getCardProgressForReadOnce(card: Card): CardProgress {
        return {
            id: card.id,
            status: CardStatus.Completed,
        };
    }

    private static getCardProgressForFirstReview(card: Card): CardProgress {
        return {
            id: card.id,
            status: CardStatus.Reviewing,
            interval: this.initialIntervalMilliseconds,
            dueDate: new Date(Date.now() + this.initialIntervalMilliseconds),
        };
    }

    private static getCardProgressForCompleted(card: Card): CardProgress {
        return {
            id: card.id,
            status: CardStatus.Completed,
        };
    }

    private static getCardProgressForNextReview(card: Card, newInterval: number): CardProgress {
        return {
            id: card.id,
            status: CardStatus.Reviewing,
            interval: newInterval,
            dueDate: new Date(Date.now() + newInterval),
        };
    }
}

export {
    lerp,
    Review,
};
