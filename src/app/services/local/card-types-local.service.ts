import { Injectable } from '@angular/core';
import { Observable, switchMap, forkJoin, map, tap, mapTo } from 'rxjs';
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

    public saveNewCardType(newCardType: NewCardType): Observable<CardType> {
        let cardType = newCardType as CardType;
        return SrsDatabase.setValue('card_types', cardType).pipe(
            map(id => ({ ...cardType, id })),
            tap(savedCardType => cardType = savedCardType),
            switchMap(savedCardType => forkJoin(savedCardType.fields.map(field => {
                field.cardTypeId = savedCardType.id;
                return SrsDatabase.setValue('card_type_fields', field).pipe(
                    map(id => ({ ...field, id })),
                );
            })).pipe(
                map(savedFields => ({ ...cardType, fields: savedFields })),
            )),
            tap(savedCardType => cardType = savedCardType),
            switchMap(savedCardType => SrsDatabase.setValue('card_types', savedCardType).pipe(
                mapTo(savedCardType),
            )),
        );
    }
}
