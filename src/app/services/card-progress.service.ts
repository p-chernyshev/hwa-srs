import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CardProgress } from '../types/card-progress';
import { NewCardReview } from '../types/card-review';

interface CardProgressPostBody extends Omit<CardProgress, 'dueDate'> {
    dueDate?: string;
}

interface CardReviewPostBody extends Omit<NewCardReview, 'dateReviewed'> {
    dateReviewed: string;
}

@Injectable({
    providedIn: 'root',
})
export class CardProgressService {
    private static readonly urlProgress = `${environment.apiUrl}/CardProgress`;
    private static readonly urlReview = `${environment.apiUrl}/CardReview`;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public updateCardProgress(cardProgress: CardProgress, cardReview: NewCardReview): Observable<void> {
        const body: CardProgressPostBody = {
            ...cardProgress,
            dueDate: cardProgress.dueDate?.toJSON(),
        };
        return this.httpClient.put<void>(`${CardProgressService.urlProgress}/${cardReview.cardId}`, body).pipe(
            switchMap(_ => this.saveNewCardReview(cardReview)),
        );
    }

    private saveNewCardReview(cardReview: NewCardReview): Observable<void> {
        const body: CardReviewPostBody = {
            ...cardReview,
            dateReviewed: cardReview.dateReviewed.toJSON(),
        };
        return this.httpClient.post<void>(CardProgressService.urlReview, body);
    }
}
