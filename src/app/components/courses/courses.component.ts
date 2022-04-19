import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ReplaySubject, BehaviorSubject, Subject, takeUntil, finalize } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../types/course';

@Component({
    selector: 'srs-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent implements OnInit, OnDestroy {
    public courses$ = new ReplaySubject<Course[]>(1);
    public loading$ = new BehaviorSubject<boolean>(false);

    private destroy$ = new Subject<void>();

    constructor(
        private coursesService: CoursesService,
    ) {
    }

    public ngOnInit(): void {
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
}
