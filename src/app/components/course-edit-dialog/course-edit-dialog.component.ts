import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'srs-course-edit-dialog',
    templateUrl: './course-edit-dialog.component.html',
    styleUrls: ['./course-edit-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseEditDialogComponent implements OnInit {
    public formGroup = new FormGroup({
        name: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
    });

    constructor(
        private dialogRef: MatDialogRef<CourseEditDialogComponent>,
    ) {
    }

    public ngOnInit(): void {
    }

    public save(): void {
        if (this.formGroup.invalid) return;
        this.dialogRef.close(this.formGroup.value);
    }
}
