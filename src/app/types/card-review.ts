import { Card } from './card';

interface CardReview {
    dateReviewed: Date;
    answer: number;
    cardId: Card['id'];
}

type NewCardReview = CardReview;

export {
    CardReview,
    NewCardReview,
};
