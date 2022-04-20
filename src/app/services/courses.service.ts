import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course, NewCourse } from '../types/course';

@Injectable({
    providedIn: 'root',
})
export class CoursesService {
    private static readonly url = `${environment.apiUrl}/course`;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getCourses(): Observable<Course[]> {
        return this.httpClient.get<Course[]>(CoursesService.url);
    }

    public saveNewCourse(course: NewCourse): Observable<Course> {
        return this.httpClient.post<Course>(CoursesService.url, course);
    }
}
