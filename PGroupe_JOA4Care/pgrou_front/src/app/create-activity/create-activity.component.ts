import { Component } from '@angular/core';
import { Activite } from '../activites/activite.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { UploadImageActivitieService } from '../shared/upload-images-activities/upload-image-activitie.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.css',
})
export class CreateActivityComponent {
  newActivity: Activite = {
    NP_max: 0,
    date: '',
    description: '',
    horaire_debut: '',
    horaire_fin: '',
    horaire_date_debut: '',
    horaire_date_fin: '',
    prix: 0,
    titre: '',
    type: '',
    imgURL: '',
    status: 'En attente',
    rating: 1,
    NP_inscrit: 0,
  };

  constructor(
    public db: AngularFireDatabase,
    private imageUploadService: UploadImageActivitieService,
    private storage: AngularFireStorage,
    private router: Router
  ) {}

  getDataForm() {
    if (this.isNewActivityEmpty()) {
      this.newActivity.horaire_date_debut =
        this.newActivity.date + ' ' + this.newActivity.horaire_debut;
      this.newActivity.horaire_date_fin =
        this.newActivity.date + ' ' + this.newActivity.horaire_fin;

      this.db.database.ref('/activites').push(this.newActivity);

      // Appelle de la fonction pour effacer tous les champs.
      this.clearForm();
      alert('Lévénement a été créé');
      this.router.navigate(['/acceuil']);
    } else {
      alert('Remplissez tous les champs du formulaire.');
    }
  }

  isNewActivityEmpty(): boolean {
    // Verifica se todos os campos estão preenchidos
    return !!(
      this.newActivity.NP_max &&
      this.newActivity.date &&
      this.newActivity.description &&
      this.newActivity.horaire_debut &&
      this.newActivity.horaire_fin &&
      this.newActivity.titre &&
      this.newActivity.type &&
      this.newActivity.imgURL
    );
  }

  // Efface tous les champs.
  clearForm() {
    this.newActivity = {
      NP_max: 0,
      date: '',
      description: '',
      horaire_debut: '',
      horaire_fin: '',
      horaire_date_debut: '',
      horaire_date_fin: '',
      prix: -1,
      titre: '',
      type: '',
      imgURL: '',
      status: '',
      rating: 0,
      NP_inscrit: 0,
    };
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageUploadService.uploadImage(file).subscribe(
        (url) => {
          // Criar uma referência com a URL do arquivo carregado
          const ref = this.storage.refFromURL(url);
          // Obter a URL de download do arquivo
          ref.getDownloadURL().subscribe(
            (downloadURL) => {
              this.newActivity.imgURL = downloadURL;
            },
            (error) => {
              console.error('Error getting download URL:', error);
            }
          );
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }
}
