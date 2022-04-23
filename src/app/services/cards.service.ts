import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card, NewCard } from '../types/card';
import { Course } from '../types/course';
import { CourseReview } from '../types/course-review';

@Injectable({
    providedIn: 'root',
})
export class CardsService {
    private static readonly url = `${environment.apiUrl}/Card`;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getReviewCards(courseId: Course['id']): Observable<CourseReview> {
        return this.httpClient.get<CourseReview>(`${CardsService.url}/Review/${courseId}`);
    }

    public saveNewCard(card: NewCard): Observable<Card> {
        return this.httpClient.post<Card>(CardsService.url, card);
    }
}
