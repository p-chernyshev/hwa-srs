import { Observable } from 'rxjs';
import { Card, NewCard } from '../types/card';
import { Course } from '../types/course';
import { CourseReview } from '../types/course-review';

export abstract class CardsService {
    public abstract getReviewCards(courseId: Course['id']): Observable<CourseReview>;

    public abstract saveNewCard(card: NewCard): Observable<Card>;
}
