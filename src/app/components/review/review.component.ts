import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil, finalize } from 'rxjs';
import { CardProgressHttpService } from '../../services/http/card-progress-http.service';
import { CardsHttpService } from '../../services/http/cards-http.service';
import { Card } from '../../types/card';
import { NewCardReview } from '../../types/card-review';
import { Course } from '../../types/course';
import { shuffle } from '../../utils/array';
import { Review } from '../../utils/review';

@Component({
    selector: 'srs-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent implements OnInit, OnDestroy {
    public loading$ = new BehaviorSubject<boolean>(false);
    public card?: Card;
    public answerShown: boolean = false;

    private courseId: Course['id'];
    private cards: Card[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        private cardsService: CardsHttpService,
        private cardProgressService: CardProgressHttpService,
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer,
    ) {
        this.courseId = Number(this.route.snapshot.params['course_id']);
    }

    public ngOnInit(): void {
        this.getCards();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
    }

    private getCards(): void {
        this.loading$.next(true);
        this.cardsService.getReviewCards(this.courseId)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.loading$.next(false)),
            )
            .subscribe(reviewCards => {
                this.cards = [
                    ...shuffle(reviewCards.new),
                    ...shuffle(reviewCards.due),
                ]
                    .reverse();
                this.showNextCard();
            });
    }

    public getCardDisplayParts(card: Card): SafeHtml[] {
        const cardTypeDesignParts = card.cardType.design.split(/^---*$/m);
        return cardTypeDesignParts.map(displayPart => {
            for (const cardTypeField of card.cardType.fields) {
                const cardFieldData = card.fields.find(field => field.fieldId === cardTypeField.id);
                const fieldNameRegExp = new RegExp(`\\{\\{${cardTypeField.name}\\}\\}`, 'g');
                displayPart = displayPart.replace(fieldNameRegExp, cardFieldData?.value || '');
            }
            return this.domSanitizer.bypassSecurityTrustHtml(displayPart);
        });
    }

    public showAnswer(): void {
        this.answerShown = true;
    }

    public submitReviewAnswer(card: Card, value: number): void {
        const cardReview: NewCardReview = {
            cardId: card.id,
            answer: value,
            dateReviewed: new Date(),
        };

        this.loading$.next(true);
        this.cardProgressService.updateCardProgress(
            Review.getUpdatedCardProgress(card, cardReview),
            cardReview,
        )
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.loading$.next(false)),
            )
            .subscribe(_ => {
                this.showNextCard();
            });
    }

    private showNextCard(): void {
        this.answerShown = false;
        this.card = this.cards.pop();
    }
}
