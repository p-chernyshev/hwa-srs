import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class NavigationService implements OnDestroy {
    public backRoute?: string;

    constructor(
        private router: Router,
    ) {
        document.addEventListener('backbutton', this.backButtonListener);
    }

    private backButtonListener = async(): Promise<void> => {
        if (!this.backRoute) return;
        await this.router.navigateByUrl(this.backRoute);
        // TODO Разобраться с дублированием содержимого router-outlet на андроиде, убрать reload
        location.reload();
    };

    public ngOnDestroy(): void {
        document.removeEventListener('backbutton', this.backButtonListener);
    }
}
