import { Observable } from 'rxjs';
import { Course, NewCourse, ListCourse } from '../types/course';

export abstract class CoursesService {
    public abstract getCourses(): Observable<ListCourse[]>;
    public abstract getCourse(id: Course['id']): Observable<ListCourse>;
    public abstract saveNewCourse(course: NewCourse): Observable<Course>;
    public abstract saveEditCourse(course: Course): Observable<Course>;
    public abstract deleteCourse(course: Course): Observable<void>;
}
