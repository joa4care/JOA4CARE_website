import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Activite } from './activite.model';
import { ActivitesService } from 'src/app/shared/activites.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthentificationService } from '../authentification/authentification.service';
import { User } from '../authentification/user.model';

import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-activites',
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.css',
})
export class ActivitesComponent implements OnInit {
  typeActivite: any;
  loadedActivites: Activite[] = [];
  displayedActivites: any[] = [];
  isFetching = false;
  // @ts-ignore
  formattedTitle: string;
  uid: string = '';
  admList: string[] = ['UJxrCpOzjqeda8NisOxrx3alqsO2'];
  admMASTER: string[] = ['UJxrCpOzjqeda8NisOxrx3alqsO2','m2JsDEU9l6SR8EelHZafCTC7jg42','yeKYenZCYuTeYd4l3Z4ufNRi09Y2'];
  emails: string[] = [];
  uids: string[] = [];
  ids: (string | undefined)[] = [];
  roles: string[] = [];
  filteredEmails: string[] = [];
  selectedUser: any = {};
  user_list: any;

  comments: {
    email: String;
    comment: String[];
    rating: number;
    activite_id: String;
  }[] = [];
  ratings: {
    mean: number;
    activite_id: String;
    count: number;
  }[] = [];;

  constructor(
    public db: AngularFireDatabase,
    private afAuth: AuthentificationService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storage: AngularFireStorage,
    private activitesService: ActivitesService
  ) {}

  ngOnInit() {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const firstChild = this.route.snapshot.firstChild;
        console.log(firstChild);
        if (firstChild && firstChild.data && 'state' in firstChild.data) {
          const shouldClickButton = firstChild.data['state'];
          const buttonId = shouldClickButton['ID'];
          const button = document.getElementById(buttonId);
          if (button) {
            button.click();
          }
        }
      }
    });

    this.ratings = [{mean:0 ,activite_id:'',count:0}]

    this.filteredEmails = this.emails;

    this.afAuth.user.subscribe((user: User) => {
      if (user) {
        this.uid = user.id;
      }
    });

    this.afAuth.fetchUsers().subscribe((users) => {
      this.emails = users.map((user) => user.email);
      this.uids = users.map((user) => user.uid);
      this.ids = users.map((user) => user.id);
      this.roles = users.map((user) => user.role);
      this.user_list = users.map((user) => user.listeActivites);


      for (let [i, email] of this.emails.entries()) {
        const userActivites = this.user_list[i];
        if (userActivites && typeof userActivites === 'object') {
            for (let activiteKey in userActivites) {
                if (userActivites.hasOwnProperty(activiteKey)) {
                    const activite = userActivites[activiteKey];
                    const { rating, comment } = activite;
                    if (comment && rating) {
                        this.comments?.push({ activite_id: activiteKey, email: email, comment: comment, rating: rating });
    
                        const existingRatingIndex = this.ratings.findIndex((item) => item.activite_id === activiteKey);
                        if (existingRatingIndex !== -1) {

                            const existingMean = this.ratings[existingRatingIndex].mean;
                            const count = this.ratings[existingRatingIndex].count+1;
                            const updatedMean = (existingMean + rating) / count; 
                            this.ratings[existingRatingIndex].mean = updatedMean;
                            this.ratings[existingRatingIndex].count = count;

                        } else {

                            this.ratings.push({ activite_id: activiteKey, mean: rating , count: 1});
                        }
                    }
                }
            }
        }
    }})

    this.route.params.subscribe((params) => {
      // @ts-ignore
      this.typeActivite = params['type'];
      this.formattedTitle = this.getFormattedTitle();
      this.isFetching = true;
      this.activitesService.fetchActivites().subscribe((activites) => {
        this.displayedActivites = [];
        this.isFetching = false;
        for (let activite of activites) {
          if (activite.type == this.typeActivite) {
            this.displayedActivites.push(activite);
          }
        }
      });
    });
  }
  
  getAverageRating(id: String){
    if(this.ratings[this.ratings.findIndex((item) => item.activite_id === id)]){
    return this.ratings[this.ratings.findIndex((item) => item.activite_id === id)].mean;
    }
    else {
      return 0;
    }
  }

  changeRole(id: string, newRole: string) {
    this.db.database
      .ref(`/users/${id}`)
      .update({ role: newRole })
      .then(() => {
        alert(
          `Changing role to ${newRole} for user ${this.selectedUser.email}`
        );
        window.location.reload();
      });
  }

  filterNames(event: any) {
    const searchTerm = event.target.value;
    this.filteredEmails = this.emails.filter((email) =>
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  listeDeInscrits(id: String){
    const emails = [];
    if (this.user_list) {
    for (let [i,list] of this.user_list.entries()) {
      const userActivites = this.user_list[i];
      if (userActivites && typeof userActivites === 'object') {
          for (let activiteKey in userActivites) {
              if (userActivites.hasOwnProperty(activiteKey)) {
                if (activiteKey === id) {
                  emails.push(this.emails[i])
                }
              }
          }
      } 
    }
    return emails 
  }
  return
  }

  handleUserClick(email: string) {
    const index = this.emails.indexOf(email);
    if (index !== -1) {
      const uid = this.uids[index];
      const role = this.roles[index];
      const id = this.ids[index];
      this.selectedUser = {
        email: email,
        uid: uid,
        role: role,
        id: id,
      };
      console.log('User:', this.selectedUser);
    }
  }

  isADM() {
    const user = this.afAuth.user.value;
    if (user) {
      const index = this.emails.indexOf(user.email);
      if (index !== -1 && this.roles[index] === 'Admin') {
        return true;
      }
    }
    return false;
  }

  AddADM(adm: string) {
    this.admList.push(adm);
  }

  RemoveADM(adm: string) {
    const index = this.admList.indexOf(adm);
    if (index !== -1) {
      this.admList.splice(index, 1);
    }
  }

  onCreationActivite(activite: Activite) {
    this.activitesService.createActivite(activite);
  }

  onFetchActivites() {
    this.isFetching = true;
    this.activitesService.fetchActivites().subscribe((activites) => {
      this.isFetching = false;
      this.loadedActivites = activites;
    });
  }

  deleteActivite(activiteId: string) {
    this.db.database
      .ref('/users')
      .once('value')
      .then((snapshot) => {
        const users = snapshot.val();
        const updatePromises = [];
        for (const userId in users) {
          const user = users[userId];
          let shouldUpdateUser = false;
          const updatedListeActivites = { ...user.listeActivites };
          if (user.listeActivites && typeof user.listeActivites === 'object') {
            for (const key in user.listeActivites) {
              if (key === activiteId) {
                delete updatedListeActivites[key];
                shouldUpdateUser = true;
              }
            }
          }
          if (shouldUpdateUser) {
            const updatePromise = this.db.database
              .ref(`/users/${userId}`)
              .update({ listeActivites: updatedListeActivites });
            updatePromises.push(updatePromise);
          }
        }
        return Promise.all(updatePromises);
      })

      .then(async () => {
        return await this.deleteImageFromStorage(activiteId); // Exclui a imagem do armazenamento
      })
      .then(() => {
        return this.db.database.ref(`/activites/${activiteId}`).remove();
      })
      .then(() => {
        this.ngOnInit();
        alert(
          'Événement supprimé et retiré des listes des utilisateurs inscrits.'
        );
      })
      .catch((error) => {
        console.error(error);
        alert(
          "Erreur lors de la suppression d'une activité et de la mise à jour des listes d'utilisateurs"
        );
      });
  }

  EnleverInscription(email: string, activite: Activite){
    const id = this.ids[this.emails.indexOf(email)]
    this.activitesService.EnleverInscription(id, email, activite);
    
  }

  getFormattedTitle(): string {
    switch (this.typeActivite) {
      case 'me-distraire':
        return 'Activites Distractives';
      case 'etre-apaise':
        return 'Activites Apaisantes';
      case 'minstruire':
        return 'Activites Instructives';
      case 'etre-soutenu':
        return 'Activites de Soutien';
      default:
        return 'Activites ' + this.typeActivite;
    }
  }

  sinscrire(activite: Activite) {
    if (activite.id) {
      const name = activite.id;
      const user = this.afAuth.user.value;
      const id = this.ids[this.uids.indexOf(user.id)];
      let NP_inscrit = activite.NP_inscrit;

      if (activite.NP_inscrit < activite.NP_max) {
        if (
          this.user_list[this.uids.indexOf(user.id)] == undefined ||
          Object.keys(this.user_list[this.uids.indexOf(user.id)]).indexOf(
            activite.id
          ) === -1
        ) {
          NP_inscrit++;
          this.db.database
            .ref(`/activites/${activite.id}`)
            .update({ NP_inscrit: NP_inscrit });

          const updateData: UpdateData = {};
          updateData[name] = {
            titre: activite.titre,
            status: 'En attente',
          };

          this.db.database
            .ref(`/users/${id}/listeActivites`)
            .update(updateData)
            .then(() => {
              alert(`${user.email} est inscrit sur ${activite.titre}`);
              this.router.navigate(['/journal']).then(() => {
                window.location.reload();
              });
            });
        } else {
          alert(`Vous êttes déjà inscrit sur ${activite.titre}`);
          this.router.navigate(['/journal']).then(() => {
            window.location.reload();
          });
        }
      } else {
        if (
          Object.keys(this.user_list[this.uids.indexOf(user.id)]).indexOf(
            activite.id
          ) !== -1
        ) {
          alert(`Vous êttes déjà inscrit sur ${activite.titre}`);
          this.router.navigate(['/journal']).then(() => {
            window.location.reload();
          });
        } else {
          alert(`l'activité "${activite.titre}" est déjà pleine`);
          window.location.reload();
        }
      }
    }
  }

  onUpdateActivite(activite: any, activiteId: string) {
    if (activite) {
      const formValue = activite;
      formValue.horaire_date_debut = formValue.date + ' ' + formValue.horaire_debut;
      formValue.horaire_date_fin = formValue.date + ' ' + formValue.horaire_fin;
      this.db.database
        .ref(`/activites/${activiteId}`)
        .update(formValue)
        .then(() => {
          alert('Activité actualisé avec success!');
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error à actualiser l'activité", error);
          alert("Error à actualiser l'activité.");
        });
    }
  }

  expired(activite: Activite) {
    const date = new Date().getTime();
    if (new Date(activite.horaire_date_debut.replace(' ', 'T')).getTime() < date || activite.NP_inscrit==activite.NP_max) {
      return true;
    } else {
      return false;
    }
  }

  async deleteImageFromStorage(activiteId: string) {
    try {
      const snapshot = await this.db.database
        .ref(`/activites/${activiteId}`)
        .once('value');
      const activiteData = snapshot.val();
      const imageURLToDelete = activiteData.imgURL; 
      const ref = this.storage.refFromURL(imageURLToDelete);
      await ref.delete().toPromise();
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de limage du Storage:',
        error
      );
      throw error;
    }
  }
}


interface UpdateData {
  [key: string]: any;
}
