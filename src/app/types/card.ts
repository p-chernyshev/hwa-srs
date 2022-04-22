import { CardType, Field } from './card-type';
import { Course } from './course';

interface Card {
    id: number;
    cardTypeId: CardType['id'];
    cardType: CardType;
    courseId: Course['id'];
    // progress?: CardProgress;
    activationCondition?: string;
    tags?: string;
    fields: FieldData[];
}

interface FieldData {
    cardId: Card['id'];
    fieldId: Field['id'];
    value: string;
}

interface NewCard extends Omit<Card, 'id' | 'cardType' | 'fields'> { // | 'progress'
    fields: NewFieldData[];
}

type NewFieldData = Omit<FieldData, 'cardId'>;

export {
    Card,
    FieldData,
    NewCard,
    NewFieldData,
};
