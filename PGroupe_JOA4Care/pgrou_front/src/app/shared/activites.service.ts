import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Activite } from '../activites/activite.model';
import { exhaustMap, map, take } from 'rxjs';
import { AuthentificationService } from '../authentification/authentification.service';
import { BehaviorSubject } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({ providedIn: 'root' })
export class ActivitesService {
  private clickedEvent = new BehaviorSubject<any>(null);
  clickedEvent$ = this.clickedEvent.asObservable();
  constructor(
    private http: HttpClient,
    private authService: AuthentificationService,
    private db: AngularFireDatabase
  ) {}

  createActivite(activite: Activite) {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      this.http
        .post(
          'https://pgrou-centrale-default-rtdb.firebaseio.com/activites.json?auth=' +
            user.token,
          activite
        )
        .subscribe((response) => {
          console.log(response);
        });
    });
  }

  fetchActivites() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        // @ts-ignore
        return this.http.get<{ [key: string]: Activite }>(
          'https://pgrou-centrale-default-rtdb.firebaseio.com/activites.json?auth=' +
            user.token
        );
      }),
      map((activites) => {
        const activitesArray: Activite[] = [];
        for (const key in activites) {
          if (activites.hasOwnProperty(key)) {
            // @ts-ignore
            activitesArray.push({ ...activites[key], id: key });
          }
        }
        return activitesArray;
      })
    );
  }

  async EnleverInscription(id_user: string | undefined, email: string, activite: Activite) {
    let NP_inscrit = activite.NP_inscrit - 1;

    await this.db.database
        .ref(`/activites/${activite.id}`)
        .update({ NP_inscrit: NP_inscrit });

    await this.db.database
        .ref(`/users/${id_user}/listeActivites/${activite.id}`)
        .remove();

    await new Promise(resolve => setTimeout(resolve, 100));

    alert(email + " a été suprimer de " + activite.titre);
    window.location.reload()
}


  
}
