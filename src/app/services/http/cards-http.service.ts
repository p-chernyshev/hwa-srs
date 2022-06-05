import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Card, NewCard } from '../../types/card';
import { Course } from '../../types/course';
import { CourseReview } from '../../types/course-review';
import { CardsService } from '../cards.service';

@Injectable({
    providedIn: 'root',
})
export class CardsHttpService extends CardsService {
    private static readonly url = `${environment.apiUrl}/Card`;

    constructor(
        private httpClient: HttpClient,
    ) {
        super();
    }

    public getReviewCards(courseId: Course['id']): Observable<CourseReview> {
        return this.httpClient.get<CourseReview>(`${CardsHttpService.url}/Review/${courseId}`);
    }

    public saveNewCard(card: NewCard): Observable<Card> {
        return this.httpClient.post<Card>(CardsHttpService.url, card);
    }
}
