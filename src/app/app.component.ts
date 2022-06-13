import { Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
    selector: 'srs-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    constructor() {
        if (!environment.browser) {
            window.plugins.insomnia.keepAwake();
        }
    }
}
