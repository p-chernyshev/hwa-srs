import { Injectable } from '@angular/core';
import { Observable, map, forkJoin, switchMap } from 'rxjs';
import { NewCourse, ListCourse, Course } from '../../types/course';
import { CoursesService } from '../courses.service';
import { CardsLocalService } from './cards-local.service';
import { SrsDatabase } from './srs-database';

@Injectable({
    providedIn: 'root',
})
export class CoursesLocalService extends CoursesService {
    constructor(
        private cardsLocalService: CardsLocalService,
    ) {
        super();
    }

    public deleteCourse(course: Course): Observable<void> {
        return SrsDatabase.deleteValue('courses', course.id);
    }

    public getCourse(id: Course['id']): Observable<ListCourse> {
        return SrsDatabase.getValue('courses', id).pipe(
            switchMap(course => {
                if (!course) throw new Error(`Не найден курс с id ${id}`);
                return this.getListCourse(course);
            }),
        );
    }

    public getCourses(): Observable<ListCourse[]> {
        return SrsDatabase.getValues('courses').pipe(
            switchMap(courses => forkJoin(courses.map(course => this.getListCourse(course)))),
        );
    }

    private getListCourse(course: Course): Observable<ListCourse> {
        return this.cardsLocalService.getReviewCards(course.id).pipe(
            map(review => ({
                ...course,
                due: review.due.length,
                new: review.new.length,
            })),
        );
    }

    public saveEditCourse(course: Course): Observable<Course> {
        return SrsDatabase.setValue('courses', course);
    }

    public saveNewCourse(course: NewCourse): Observable<Course> {
        return SrsDatabase.setValue('courses', course);
    }
}
