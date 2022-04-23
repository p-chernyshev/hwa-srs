import { Card } from './card';

interface CardProgress {
    id: Card['id'];
    status: CardStatus;
    dueDate?: Date;
    interval?: number; // milliseconds
}

enum CardStatus {
    Activated = 1,
    Reviewing = 2,
    Completed = 3,
}

export {
    CardProgress,
    CardStatus,
};
