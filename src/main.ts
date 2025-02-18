import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { SessionVaultService } from './app/core/session-vault.service';
import { APP_INITIALIZER } from '@angular/core';

const appInitFactory =
  (vault: SessionVaultService): (() => Promise<void>) =>
  async () => {
    await vault.initialize();
  };

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [SessionVaultService],
      multi: true,
    },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
