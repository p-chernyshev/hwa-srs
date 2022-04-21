import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Course, NewCourse, ListCourse } from '../types/course';

@Injectable({
    providedIn: 'root',
})
export class CoursesService {
    private static readonly url = `${environment.apiUrl}/Course`;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getCourses(): Observable<ListCourse[]> {
        return this.httpClient.get<ListCourse[]>(CoursesService.url);
    }

    public getCourse(id: Course['id']): Observable<ListCourse> {
        return this.httpClient.get<ListCourse>(`${CoursesService.url}/${id}`);
    }

    public saveNewCourse(course: NewCourse): Observable<Course> {
        return this.httpClient.post<Course>(CoursesService.url, course);
    }

    public saveEditCourse(course: Course): Observable<Course> {
        return this.httpClient.put<Course>(`${CoursesService.url}/${course.id}`, course);
    }

    public deleteCourse(course: Course): Observable<void> {
        return this.httpClient.delete<void>(`${CoursesService.url}/${course.id}`);
    }
}
