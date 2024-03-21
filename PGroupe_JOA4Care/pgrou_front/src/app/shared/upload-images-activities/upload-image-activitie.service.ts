import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UploadImageActivitieService {
  private basePath = '/images-activities';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  uploadImage(image: File): Observable<string> {
    const filePath = `images-activites/${image.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, image);

    return new Observable<string>((observer) => {
      task
        .then(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            observer.next(url);
            observer.complete();
          });
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // private async saveImageUrlToDatabase(
  //   activityId: string,
  //   imageUrl: string
  // ): Promise<void> {
  //   try {
  //     await this.db.database
  //       .ref(`activites/${activityId}/image-activite`)
  //       .push(imageUrl);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
