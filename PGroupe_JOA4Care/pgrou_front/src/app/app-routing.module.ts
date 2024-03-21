import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ActivitesComponent } from './activites/activites.component';
import { PlanningComponent } from './planning/planning.component';
import { JournalComponent } from './journal/journal.component';
import { CreateActivityComponent } from './create-activity/create-activity.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { AuthGuard } from './authentification/authentification.guard';

const routes: Routes = [
  { path: '', redirectTo: 'authentification', pathMatch: 'full' },
  { path: 'acceuil', component: AccueilComponent, canActivate: [AuthGuard] },
  { path: 'authentification', component: AuthentificationComponent },
  {
    path: 'activites/:type',
    component: ActivitesComponent,
    canActivate: [AuthGuard],
  },
  { path: 'planning', component: PlanningComponent, canActivate: [AuthGuard] },
  { path: 'journal', component: JournalComponent, canActivate: [AuthGuard] },
  {
    path: 'Creer-Activite',
    component: CreateActivityComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
