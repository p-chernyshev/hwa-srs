import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card, NewCard } from '../types/card';

@Injectable({
    providedIn: 'root',
})
export class CardsService {
    private static readonly url = `${environment.apiUrl}/Card`;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getCardTypes(): Observable<Card[]> {
        return this.httpClient.get<Card[]>(CardsService.url);
    }

    public saveNewCourse(card: NewCard): Observable<Card> {
        return this.httpClient.post<Card>(CardsService.url, card);
    }
}
