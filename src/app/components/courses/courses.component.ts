import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject, BehaviorSubject, Subject, takeUntil, finalize } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { Course, NewCourse } from '../../types/course';
import { CourseEditDialogComponent } from '../course-edit-dialog/course-edit-dialog.component';

@Component({
    selector: 'srs-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent implements OnInit, OnDestroy {
    public courses$ = new ReplaySubject<Course[]>(1);
    public loading$ = new BehaviorSubject<boolean>(false);
    public saving$ = new BehaviorSubject<boolean>(false);

    private destroy$ = new Subject<void>();

    constructor(
        private coursesService: CoursesService,
        public dialog: MatDialog,
    ) {
    }

    public ngOnInit(): void {
        this.getCourses();
    }

    private getCourses(): void {
        this.loading$.next(true);
        this.coursesService.getCourses()
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.loading$.next(false)),
            )
            .subscribe(courses => {
                this.courses$.next(courses);
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
    }

    public addCourse(): void {
        this.dialog.open<CourseEditDialogComponent, void, NewCourse>(CourseEditDialogComponent, {
            width: '300px',
            maxWidth: '100%',
        })
            .afterClosed()
            .subscribe(newCourse => {
                if (!newCourse) return;
                this.saving$.next(true);
                this.coursesService.saveNewCourse(newCourse)
                    .pipe(
                        takeUntil(this.destroy$),
                        finalize(() => this.saving$.next(false)),
                    )
                    .subscribe(_ => this.getCourses());
            });
    }
}
