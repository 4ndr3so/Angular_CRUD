// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// NgRx imports
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// Your NgRx feature & effects
import { productsFeature } from './features/products/state/products.reducer';
import { ProductsEffects } from './features/products/state/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),

    // NgRx root
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),

    // ✅ Register the feature and its effects
    provideState(productsFeature),       // <- wrap the feature
    provideEffects(ProductsEffects),     // <- register effects via provider
  ]
};
