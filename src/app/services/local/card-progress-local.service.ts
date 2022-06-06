import { Injectable } from '@angular/core';
import { Observable, forkJoin, mapTo, switchMap } from 'rxjs';
import { CardProgress } from '../../types/card-progress';
import { NewCardReview } from '../../types/card-review';
import { CardProgressService } from '../card-progress.service';
import { SrsDatabase } from './srs-database';

@Injectable({
    providedIn: 'root',
})
export class CardProgressLocalService extends CardProgressService {
    constructor(
    ) {
        super();
    }

    public updateCardProgress(cardProgress: CardProgress, cardReview: NewCardReview): Observable<void> {
        return forkJoin([
            SrsDatabase.setValue('card_progresses', cardProgress, cardProgress.id),
            this.saveNewCardReview(cardReview),
        ]).pipe(
            mapTo(undefined),
        );
    }

    private saveNewCardReview(cardReview: NewCardReview): Observable<void> {
        return SrsDatabase.getValue('card_reviews', cardReview.cardId).pipe(
            switchMap(reviews => SrsDatabase.setValue(
                'card_reviews',
                reviews
                    ? [...reviews, cardReview]
                    : [cardReview],
                cardReview.cardId,
            )),
            mapTo(undefined),
        );
    }
}
