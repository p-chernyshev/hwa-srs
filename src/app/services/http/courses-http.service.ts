import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, NewCourse, ListCourse } from '../../types/course';
import { CoursesService } from '../courses.service';

@Injectable({
    providedIn: 'root',
})
export class CoursesHttpService extends CoursesService {
    private static readonly url = `${environment.apiUrl}/Course`;

    constructor(
        private httpClient: HttpClient,
    ) {
        super();
    }

    public getCourses(): Observable<ListCourse[]> {
        return this.httpClient.get<ListCourse[]>(CoursesHttpService.url);
    }

    public getCourse(id: Course['id']): Observable<ListCourse> {
        return this.httpClient.get<ListCourse>(`${CoursesHttpService.url}/${id}`);
    }

    public saveNewCourse(course: NewCourse): Observable<Course> {
        return this.httpClient.post<Course>(CoursesHttpService.url, course);
    }

    public saveEditCourse(course: Course): Observable<Course> {
        return this.httpClient.put<Course>(`${CoursesHttpService.url}/${course.id}`, course);
    }

    public deleteCourse(course: Course): Observable<void> {
        return this.httpClient.delete<void>(`${CoursesHttpService.url}/${course.id}`);
    }
}
