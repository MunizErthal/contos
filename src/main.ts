import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/**
 * Hammerjs must be imported for gestures
 */
import 'hammerjs';

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
    // Otherise, log the boot error
}).catch(err => console.error(err));
