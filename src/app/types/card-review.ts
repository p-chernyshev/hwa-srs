import { Card } from './card';

interface CardReview {
    id: number;
    dateReviewed: Date;
    answer: number;
    cardId: Card['id'];
}

type NewCardReview = Omit<CardReview, 'id'>;

export {
    CardReview,
    NewCardReview,
};
