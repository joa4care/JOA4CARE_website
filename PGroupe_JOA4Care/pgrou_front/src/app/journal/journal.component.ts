import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';
import { User } from '../authentification/user.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivitesService } from '../shared/activites.service';
import { Activite } from '../activites/activite.model';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.css',
})
export class JournalComponent implements OnInit {
  futureActivities: any[] = [];
  pastActivities: any[] = [];
  uids: string[] = [];
  ids: (string | undefined)[] = [];
  userActivities: Activite[] = [];
  listes: any;
  liste: any;
  activites_ids: any;
  userActivites_names: any;
  selectedActivity: any;
  rate: number = 3;
  comment: any;

  constructor(
    public db: AngularFireDatabase,
    private afAuth: AuthentificationService,
    private aService: ActivitesService,
  ) {}

  ngOnInit() {
    this.afAuth.fetchUsers().subscribe((users) => {
      this.uids = users.map((user) => user.uid);
      this.ids = users.map((user) => user.id);
      this.listes = users.map((user) => user.listeActivites);
      this.aService.fetchActivites().subscribe((activites) => {
        this.activites_ids = activites.map((activite) => activite.id);
        this.afAuth.user.subscribe((user: User | null) => {
          if (user) {
            const idIndex = this.uids.indexOf(user.id);
            if (idIndex !== -1) {
              this.userActivites_names = this.listes[idIndex];

              if (
                typeof this.userActivites_names === 'object' &&
                this.userActivites_names !== null
              ) {
                Object.keys(this.userActivites_names).forEach((activityKey) => {
                  if (this.activites_ids.includes(activityKey)) {
                    const matchingActivity = activites.find(
                      (activite) => activite.id === activityKey
                    );
                    if (matchingActivity) {
                      this.userActivities.push(matchingActivity);
                    }
                  }
                });

                this.futureActivities = [];
                this.pastActivities = [];
                this.userActivities.forEach((activity) => {
                  const currentDate = new Date().getTime();
                  if (
                    new Date(
                      activity.horaire_date_debut.replace(' ', 'T')
                    ).getTime() > currentDate
                  ) {
                    this.futureActivities.push(activity);
                  } else if (
                    new Date(activity.horaire_date_fin.replace(' ', 'T')).getTime() <
                    currentDate
                  ) {
                    this.pastActivities.push(activity);
                  }
                });
              } else {
                console.error(
                  'regarder le format des activites',
                  this.userActivites_names
                );
              }
            }
          }
        });
      });
    });
  }

  getStarsArray(id: string): number {
    let index = -1;
    Object.keys(this.userActivites_names).forEach((activiteID, i) => {
      if (activiteID === id) {
        index = i;
      }
    });

    if (index !== -1) {
      let acArray: { [key: string]: any } = {};
      acArray = Object.values(this.userActivites_names);
      const rating = acArray[index].rating;
      return rating;
    } else {
      return -1;
    }
  }

  EnleverInscription(activite: Activite){
  const user = this.afAuth.user.value;
  const id_user = this.ids[this.uids.indexOf(user.id)];
  this.aService.EnleverInscription(id_user,user.email,activite)
  }

  submitEvaluation(id_activite: string, rate: number, comment: any) {
    const user = this.afAuth.user.value;
    const id_user = this.ids[this.uids.indexOf(user.id)];
    if (comment === undefined || comment.trim() === "") {
      comment = 'No comments';
    }
    this.db.database
      .ref(`/users/${id_user}/listeActivites/${id_activite}`)
      .update({ rating: rate, comment: comment })
      .then(() => {
        alert(`activité evaluée`);
        this.rate = 0;
        this.comment = undefined;
        window.location.reload();
      });
  }

  setSelectedActivity(activity: any): void {
    this.selectedActivity = activity;
    this.comment = this.userActivites_names[activity.id].comment;
    this.rate = this.userActivites_names[activity.id].rating;
  }
}
