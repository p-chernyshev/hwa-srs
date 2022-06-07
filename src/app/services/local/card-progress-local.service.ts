import { Injectable } from '@angular/core';
import { Observable, forkJoin, mapTo, switchMap, map, defaultIfEmpty } from 'rxjs';
import { Card } from '../../types/card';
import { CardProgress, CardStatus } from '../../types/card-progress';
import { NewCardReview } from '../../types/card-review';
import { CardProgressService } from '../card-progress.service';
import { SrsDatabase } from './srs-database';

type Group<TList, TKey> = { key: TKey; list: TList[] };

@Injectable({
    providedIn: 'root',
})
export class CardProgressLocalService extends CardProgressService {
    private static groupBy<TList, TKey>(
        list: TList[],
        getKey: (item: TList) => TKey,
        keyEqualityFunc: (a: TKey, b: TKey) => boolean = (a, b) => a === b,
    ): Group<TList, TKey>[] {
        return list.reduce<Group<TList, TKey>[]>(
            (groups, currentItem) => {
                const key = getKey(currentItem);
                const foundGroup = groups.find(group => keyEqualityFunc(group.key, key));
                if (foundGroup) {
                    foundGroup.list.push(currentItem);
                } else {
                    groups.push({
                        key,
                        list: [currentItem],
                    });
                }
                return groups;
            },
            [],
        );
    }

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
            switchMap(_ => this.checkActivation()),
        );
    }

    private checkActivation(): Observable<void> {
        return SrsDatabase.getValues('cards').pipe(
            switchMap(cards => forkJoin(cards.map(card => SrsDatabase.getValue('card_progresses', card.id).pipe(
                map(progress => ({ ...card, progress })),
            )))),
            defaultIfEmpty([]),
            switchMap(cards => {
                const inactiveCards = cards.filter(card => !card.progress && !!card.activationCondition);
                const inactiveCardsGroupsByCondition = CardProgressLocalService.groupBy(
                    inactiveCards,
                    card => card.activationCondition as string,
                );

                const progressSaveTransactions: Observable<Card['id']>[] = [];
                for (const conditionGroup of inactiveCardsGroupsByCondition) {
                    const conditionParts = conditionGroup.key
                        .split('&')
                        .map(subcondition => {
                            const parts = subcondition.split('=');
                            return {
                                key: parts[0].trim(),
                                value: parts[1].trim(),
                            };
                        });

                    const typeConditions = conditionParts
                        .filter(condition => condition.key.toLowerCase() === 'type')
                        .map(condition => condition.value);
                    const typeCondition = typeConditions.length === 1
                        ? typeConditions[0]
                        : null;

                    const tagConditions = conditionParts
                        .filter(condition => condition.key.toLowerCase() === 'tag')
                        .map(condition => condition.value);

                    const cardsSatisfyingCondition = cards
                        .filter(card =>
                            card.progress
                            && (!typeCondition || card.cardType.name === typeCondition)
                            && (!tagConditions.length || tagConditions.every(condition => card.tags?.includes(condition))),
                        );

                    const countCompleteCardsSatisfying = cardsSatisfyingCondition
                        .filter(card =>
                            card.progress
                            && (
                                card.progress.status === CardStatus.Completed
                                || card.progress.interval && (card.progress.interval / 1000 / 60 / 60 / 24 > 14)
                            ),
                        )
                        .length;

                    if (countCompleteCardsSatisfying / cardsSatisfyingCondition.length > 0.9) {
                        for (const card of conditionGroup.list) {
                            progressSaveTransactions.push(
                                SrsDatabase.setValue(
                                    'card_progresses',
                                    {
                                        id: card.id,
                                        status: CardStatus.Activated,
                                    },
                                    card.id,
                                ),
                            );
                        }
                    }
                }

                return forkJoin(progressSaveTransactions);
            }),
            defaultIfEmpty([]),
            mapTo(undefined),
        );
    }
}
