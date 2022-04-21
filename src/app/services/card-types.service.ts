import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CardType, NewCardType } from '../types/card-type';

@Injectable({
    providedIn: 'root',
})
export class CardTypesService {
    private static readonly url = `${environment.apiUrl}/CardType`;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getCardTypes(): Observable<CardType[]> {
        return this.httpClient.get<CardType[]>(CardTypesService.url);
    }

    public saveNewCourse(cardType: NewCardType): Observable<CardType> {
        return this.httpClient.post<CardType>(CardTypesService.url, cardType);
    }
}
