import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, finalize, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { ListCourse, Course } from '../../types/course';
import { CardEditDialogComponent } from '../card-edit-dialog/card-edit-dialog.component';

@Component({
    selector: 'srs-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit, OnDestroy {
    public course$ = new ReplaySubject<ListCourse>(1);
    public loading$ = new BehaviorSubject<boolean>(false);

    private courseId: Course['id'];
    private destroy$ = new Subject<void>();

    constructor(
        private coursesService: CoursesService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
    ) {
        this.courseId = Number(this.route.snapshot.params['course_id']);
    }

    public ngOnInit(): void {
        this.getCourse();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
    }

    private getCourse(): void {
        this.loading$.next(true);
        this.coursesService.getCourse(this.courseId)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => this.loading$.next(false)),
            )
            .subscribe(course => {
                this.course$.next(course);
            });
    }

    public addCards(): void {
        this.dialog.open(CardEditDialogComponent, {
            data: this.courseId,
            width: '400px',
            maxWidth: '100%',
        })
            .afterClosed()
            .subscribe(_ => {
                this.getCourse();
            });
    }
}
