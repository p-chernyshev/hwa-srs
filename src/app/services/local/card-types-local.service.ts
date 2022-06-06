import { Injectable } from '@angular/core';
import { Observable, switchMap, forkJoin, mapTo } from 'rxjs';
import { CardType, NewCardType } from '../../types/card-type';
import { CardTypesService } from '../card-types.service';
import { SrsDatabase } from './srs-database';

@Injectable({
    providedIn: 'root',
})
export class CardTypesLocalService extends CardTypesService {
    constructor(
    ) {
        super();
    }

    public getCardTypes(): Observable<CardType[]> {
        return SrsDatabase.getValues('card_types');
    }

    public saveNewCardType(cardType: NewCardType): Observable<CardType> {
        return SrsDatabase.setValue('card_types', cardType as CardType).pipe(
            switchMap(savedCardType => forkJoin(savedCardType.fields.map(field => {
                field.cardTypeId = savedCardType.id;
                return SrsDatabase.setValue('card_type_fields', field);
            })).pipe(
                mapTo(savedCardType),
            )),
        );
    }
}
