import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject, BehaviorSubject, Subject, takeUntil, finalize } from 'rxjs';
import { CoursesHttpService } from '../../services/http/courses-http.service';
import { Course, NewCourse, ListCourse, isNewCourse } from '../../types/course';
import { CourseEditDialogComponent } from '../course-edit-dialog/course-edit-dialog.component';

@Component({
    selector: 'srs-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent implements OnInit, OnDestroy {
    public courses$ = new ReplaySubject<ListCourse[]>(1);
    public loading$ = new BehaviorSubject<boolean>(false);
    public saving$ = new BehaviorSubject<boolean>(false);

    private destroy$ = new Subject<void>();

    constructor(
        private coursesService: CoursesHttpService,
        private dialog: MatDialog,
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
        this.editCourse();
    }

    public editCourse(course?: Course): void {
        this.dialog.open<CourseEditDialogComponent, Course | undefined, Course | NewCourse>(CourseEditDialogComponent, {
            data: course,
            width: '400px',
            maxWidth: '100%',
        })
            .afterClosed()
            .subscribe(savedCourse => {
                if (!savedCourse) return;
                const editCourseAction = isNewCourse(savedCourse)
                    ? this.coursesService.saveNewCourse(savedCourse)
                    : this.coursesService.saveEditCourse(savedCourse);

                this.saving$.next(true);
                editCourseAction
                    .pipe(
                        takeUntil(this.destroy$),
                        finalize(() => this.saving$.next(false)),
                    )
                    .subscribe(_ => this.getCourses());
            });
    }

    public deleteCourse(course: Course): void {
        this.saving$.next(true);
        this.coursesService.deleteCourse(course)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.saving$.next(false)),
            )
            .subscribe(_ => this.getCourses());
    }
}
