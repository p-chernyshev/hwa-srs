import { DBSchema } from 'idb';
import { Card } from '../../types/card';
import { CardProgress } from '../../types/card-progress';
import { CardReview } from '../../types/card-review';
import { CardType, Field } from '../../types/card-type';
import { Course } from '../../types/course';

export interface SrsDbSchema extends DBSchema {
    'courses': {
        key: Course['id'];
        value: Course;
    };
    'cards': {
        key: Card['id'];
        value: Card;
    };
    'card_types': {
        key: CardType['id'];
        value: CardType;
    };
    'card_type_fields': {
        key: Field['id'];
        value: Field;
    };
    'card_progresses': {
        key: Card['id'];
        value: CardProgress;
    };
    'card_reviews': {
        key: Card['id'];
        value: CardReview[];
    };
}
