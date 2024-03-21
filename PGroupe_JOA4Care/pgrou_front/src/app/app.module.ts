import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ActivitesComponent } from './activites/activites.component';
import { PlanningComponent } from './planning/planning.component';
import { JournalComponent } from './journal/journal.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { AccueilComponent } from './accueil/accueil.component';
import { CreateActivityComponent } from './create-activity/create-activity.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    DropdownDirective,
    ActivitesComponent,
    PlanningComponent,
    JournalComponent,
    AuthentificationComponent,
    AccueilComponent,
    LoadingSpinnerComponent,
    CreateActivityComponent,
    NavBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
  ],
  providers: [AngularFireDatabase],
  exports: [LoadingSpinnerComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
