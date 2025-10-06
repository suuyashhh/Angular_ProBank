import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';               // ensure app.ts exports AppComponent
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule),
  ]
});
