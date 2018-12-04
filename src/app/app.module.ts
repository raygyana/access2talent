import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { routing } from './app.routing';
import { fakeBackendProvider } from '../helper';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

import { AlertService } from '../services/alert.service';
import { AlertComponent } from '../_directives';
import { HttpService } from 'src/services/http.service';


@NgModule({
  declarations: [
    AppComponent,
    // AlertComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing
  ],
  providers: [fakeBackendProvider, AuthenticationService, AlertService, UserService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
