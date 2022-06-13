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
    // TODO
    //  card browser
    //  sync
    //  import/export

    // TODO Cordova lifecycle events
    // private resume: BehaviorSubject<boolean>;
    // constructor(private zone: NgZone) {
    //     this.resume = new BehaviorSubject<boolean>(null);
    //     Observable.fromEvent(document, 'resume').subscribe(event => {
    //         this.zone.run(() => {
    //             this.onResume();
    //         });
    //     });
    // }
    //
    // get cordova(): any {
    //     return _window().cordova;
    // }
    // get onCordova(): Boolean {
    //     return !!_window().cordova;
    // }
    // public onResume(): void {
    //     this.resume.next(true);
    // }
}
