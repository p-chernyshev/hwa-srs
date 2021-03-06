import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

function startApp(): void {
    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err));
}

if (environment.browser) {
    startApp();
} else {
    document.addEventListener('deviceready', startApp);
}
