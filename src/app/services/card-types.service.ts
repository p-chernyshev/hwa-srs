import { Observable } from 'rxjs';
import { CardType, NewCardType } from '../types/card-type';

export abstract class CardTypesService {
    public abstract getCardTypes(): Observable<CardType[]>;

    public abstract saveNewCardType(cardType: NewCardType): Observable<CardType>;
}
