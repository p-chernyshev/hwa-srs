import { Injectable } from '@angular/core';
import { Observable, switchMap, tap, map, forkJoin, defaultIfEmpty, mapTo } from 'rxjs';
import { NewCard, Card, FieldData } from '../../types/card';
import { CardStatus } from '../../types/card-progress';
import { Course } from '../../types/course';
import { CourseReview } from '../../types/course-review';
import { CardsService } from '../cards.service';
import { SrsDatabase } from './srs-database';

@Injectable({
    providedIn: 'root',
})
export class CardsLocalService extends CardsService {
    private static roundDownDays(date: Date): Date {
        return new Date(date.setHours(0, 0, 0, 0));
    }

    constructor(
    ) {
        super();
    }

    public getReviewCards(courseId: Course['id']): Observable<CourseReview> {
        return SrsDatabase.getValues('cards').pipe(
            map(cards => cards.filter(card => card.courseId === courseId)),
            switchMap(cards => forkJoin(cards.map(card => SrsDatabase.getValue('card_progresses', card.id).pipe(
                map(progress => ({ ...card, progress })),
            )))),
            defaultIfEmpty([]),
            map(cards => ({
                id: courseId,
                due: cards.filter(card =>
                    card.progress
                    && card.progress.status === CardStatus.Reviewing
                    && card.progress.dueDate
                    && CardsLocalService.roundDownDays(card.progress.dueDate) <= new Date(),
                ),
                new: cards.filter(card =>
                    !card.progress && !card.activationCondition
                    || card.progress && card.progress.status === CardStatus.Activated,
                ),
            })),
        );
    }

    public saveNewCard(newCard: NewCard): Observable<Card> {
        return SrsDatabase.getValue('card_types', newCard.cardTypeId).pipe(
            switchMap(cardType => {
                if (!cardType) throw new Error(`Не найден тип с id ${newCard.cardTypeId}`);
                const card = {
                    ...newCard,
                    cardType,
                    fields: newCard.fields as FieldData[],
                };
                return SrsDatabase.setValue('cards', card).pipe(
                    map(id => ({ ...card, id })),
                );
            }),
            tap(card => card.fields.forEach(field => field.cardId = card.id)),
            switchMap(card => SrsDatabase.setValue('cards', card).pipe(
                mapTo(card),
            )),
        );
    }
}
