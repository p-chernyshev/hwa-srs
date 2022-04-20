import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewCourse, Course } from '../../types/course';

@Component({
    selector: 'srs-course-edit-dialog',
    templateUrl: './course-edit-dialog.component.html',
    styleUrls: ['./course-edit-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseEditDialogComponent implements OnInit {
    public formGroup = new FormGroup({
        id: new FormControl(null),
        name: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
    });

    constructor(
        private dialogRef: MatDialogRef<CourseEditDialogComponent, Course | NewCourse>,
        @Inject(MAT_DIALOG_DATA) public course?: Course,
    ) {
        if (course) {
            this.formGroup.patchValue({
                id: course.id,
                name: course.name,
                description: course.description,
            });
        } else {
            this.formGroup.controls['id'].disable();
        }
    }

    public ngOnInit(): void {
    }

    public save(): void {
        if (this.formGroup.invalid) return;
        this.dialogRef.close(this.formGroup.value);
    }
}
