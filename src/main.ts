import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';               // ensure app.ts exports AppComponent
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withFetch()),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
  ]
});
