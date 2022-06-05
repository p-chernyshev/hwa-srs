import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CardType, NewCardType } from '../../types/card-type';
import { CardTypesService } from '../card-types.service';

@Injectable({
    providedIn: 'root',
})
export class CardTypesHttpService extends CardTypesService {
    private static readonly url = `${environment.apiUrl}/CardType`;

    constructor(
        private httpClient: HttpClient,
    ) {
        super();
    }

    public getCardTypes(): Observable<CardType[]> {
        return this.httpClient.get<CardType[]>(CardTypesHttpService.url);
    }

    public saveNewCardType(cardType: NewCardType): Observable<CardType> {
        return this.httpClient.post<CardType>(CardTypesHttpService.url, cardType);
    }
}
