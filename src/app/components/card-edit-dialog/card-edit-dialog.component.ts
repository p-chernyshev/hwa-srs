import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subject, takeUntil, finalize } from 'rxjs';
import { CardTypesService } from '../../services/card-types.service';
import { CardsService } from '../../services/cards.service';
import { CardType } from '../../types/card-type';
import { Course } from '../../types/course';

interface FormGroupValue {
    cardTypeId: CardType['id'];
    activationCondition?: string;
    tags?: string;
    fields: string[];
}

@Component({
    selector: 'srs-card-edit-dialog',
    templateUrl: './card-edit-dialog.component.html',
    styleUrls: ['./card-edit-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardEditDialogComponent implements OnInit, OnDestroy {
    public cardTypes$ = new BehaviorSubject<CardType[]>([]);
    public loading$ = new BehaviorSubject<boolean>(false);
    public saving$ = new BehaviorSubject<boolean>(false);

    public cardTypeSelected?: CardType;

    public formGroup: FormGroup;

    private destroy$ = new Subject<void>();

    constructor(
        private dialogRef: MatDialogRef<CardEditDialogComponent>,
        private cardTypesService: CardTypesService,
        private cardsService: CardsService,
        @Inject(MAT_DIALOG_DATA) public courseId: Course['id'],
    ) {
        this.formGroup = new FormGroup({
            cardTypeId: new FormControl(null, Validators.required),
            activationCondition: new FormControl(null),
            tags: new FormControl(null),
            fields: new FormArray([]),
        });
    }

    public ngOnInit(): void {
        this.loading$.subscribe(loading => {
            if (loading) {
                this.formGroup.controls['cardTypeId'].disable();
            } else {
                this.formGroup.controls['cardTypeId'].enable();
            }
        });
        this.getCardTypes();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
    }

    private getCardTypes(): void {
        this.loading$.next(true);
        this.cardTypesService.getCardTypes()
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.loading$.next(false)),
            )
            .subscribe(courses => {
                this.cardTypes$.next(courses);
            });
    }

    public save(): void {
        if (!this.cardTypeSelected || this.formGroup.invalid) return;
        const selectedCardTypeFields = this.cardTypeSelected.fields;
        const formValue: FormGroupValue = this.formGroup.value;

        const newCard = {
            courseId: this.courseId,
            cardTypeId: formValue.cardTypeId,
            activationCondition: formValue.activationCondition,
            tags: formValue.tags,
            fields: formValue.fields.map((fieldValue, i) => ({
                fieldId: selectedCardTypeFields[i].id,
                value: fieldValue,
            })),
        };

        this.saving$.next(true);
        this.cardsService.saveNewCard(newCard)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.saving$.next(false)),
            )
            .subscribe(_ => {
                // TODO Найти способ сбросить состояние валидации fieldsFormArray при сбросе формгруппы
                this.formGroup.reset({
                    cardTypeId: formValue.cardTypeId,
                });
            });

    }

    public selectCardType({ value }: { value: FormGroupValue['cardTypeId'] }): void {
        this.cardTypeSelected = this.cardTypes$.value.find(cardType => cardType.id === value);

        const fieldsFormArray = this.formGroup.controls['fields'] as FormArray;

        fieldsFormArray.clear();
        for (const field of this.cardTypeSelected?.fields || []) {
            fieldsFormArray.push(new FormControl(null, Validators.required));
        }
    }
}
