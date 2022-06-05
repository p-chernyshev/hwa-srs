import { Observable } from 'rxjs';
import { CardProgress } from '../types/card-progress';
import { NewCardReview } from '../types/card-review';

export abstract class CardProgressService {
    public abstract updateCardProgress(cardProgress: CardProgress, cardReview: NewCardReview): Observable<void>;
}
