import { Card } from './card';
import { Course } from './course';

export interface CourseReview {
    id: Course['id'];
    due: Card[];
    new: Card[];
}
