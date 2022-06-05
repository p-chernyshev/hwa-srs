import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, takeUntil, finalize, Subject } from 'rxjs';
import { CardTypesHttpService } from '../../services/http/card-types-http.service';
import { NewCardType } from '../../types/card-type';

interface FormGroupValue {
    name: string;
    design: string;
    readOnce: boolean;
    fields: string[];
}

@Component({
    selector: 'srs-card-type-edit-dialog',
    templateUrl: './card-type-edit-dialog.component.html',
    styleUrls: ['./card-type-edit-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTypeEditDialogComponent implements OnInit, OnDestroy {
    public saving$ = new BehaviorSubject<boolean>(false);

    public formGroup = new FormGroup({
        name: new FormControl(null, Validators.required),
        design: new FormControl(null, Validators.required),
        readOnce: new FormControl(false),
        fields: new FormArray([]),
    });

    private destroy$ = new Subject<void>();

    constructor(
        private dialogRef: MatDialogRef<CardTypeEditDialogComponent>,
        private cardTypesService: CardTypesHttpService,
    ) {
    }

    public ngOnInit(): void {
        this.addField();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
    }

    public get fieldsFormArray(): FormArray {
        return this.formGroup.controls['fields'] as FormArray;
    }

    public addField(): void {
        this.fieldsFormArray.push(new FormControl(null, Validators.required));
    }

    public deleteField(i: number): void {
        this.fieldsFormArray.removeAt(i);
    }

    public save(): void {
        if (this.formGroup.invalid) return;

        const formValue: FormGroupValue = this.formGroup.value;

        const newType: NewCardType = {
            name: formValue.name,
            design: formValue.design,
            readOnce: formValue.readOnce,
            fields: formValue.fields.map(fieldName => ({
                name: fieldName,
            })),
        };

        this.saving$.next(true);
        this.cardTypesService.saveNewCardType(newType)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.saving$.next(false)),
            )
            .subscribe(_ => {
                this.dialogRef.close();
            });
    }
}
