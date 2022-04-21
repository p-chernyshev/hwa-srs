interface CardType {
    id: number;
    name: string;
    readOnce: boolean;
    design: string;
    fields: Field[];
}

interface Field {
    id: number;
    name: string;
    cardTypeId: CardType['id'];
}

interface NewCardType extends Omit<CardType, 'id' | 'fields'> {
    fields: NewField[];
}

type NewField = Omit<Field, 'id' | 'cardTypeId'>;

export {
    CardType,
    Field,
    NewCardType,
    NewField,
};
