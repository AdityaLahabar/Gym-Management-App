import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
//import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptorProvider } from './core/interceptors/auth.interceptor';

//import { routes } from './app/app.routes';
//import { AuthInterceptorProvider } from './app/core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
         // tokenGetter,
          allowedDomains: ['localhost:4200'],
          disallowedRoutes: []
        }
      })
    ),
    AuthInterceptorProvider]
};
