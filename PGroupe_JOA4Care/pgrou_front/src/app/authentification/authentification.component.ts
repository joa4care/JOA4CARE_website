import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  AuthentificationService,
  AuthentificationResponseData,
} from './authentification.service';
import { AppModule } from '../app.module';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AppComponent } from '../app.component';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.css',
})
export class AuthentificationComponent {
  uids!: string[];
  ids!: (string | undefined)[];
  users: any;
  db: any;
  photos: string[] | undefined;
  id_user: string | undefined;
  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private appComponent: AppComponent
  ) {}
  isLoginMode = true;
  isLoading = false;
  // @ts-ignore
  error: string = null;
  termsAccepted: boolean = false;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmitLogin(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthentificationResponseData>;
    this.isLoading = true;
    authObs = this.authService.login(email, password);

    authObs.subscribe(
      (resData) => {
        this.isLoading = false;
        this.router.navigate(['/acceuil']);
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    form.reset();
  }
  onSubmitSignUp(form: NgForm) {
    console.log(form.value);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthentificationResponseData>;
    this.isLoading = true;

    authObs = this.authService.signup(email, this.pathProfilePhoto, password);

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/acceuil']);
        alert('Votre compte a été créé avec succès');
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    form.reset();
  }

  pathProfilePhoto: string = '';
  avatarPath(path: string): void {
    this.pathProfilePhoto = path;
  }

  elements: any = {
    avatar1: '',
    avatar2: '',
    avatar3: '',
    avatar4: '',
  };
  selectAvatar(avatarNumber: any): void {
    this.elements.avatar1 = document.getElementById('avatar1');
    this.elements.avatar2 = document.getElementById('avatar2');
    this.elements.avatar3 = document.getElementById('avatar3');
    this.elements.avatar4 = document.getElementById('avatar4');
    if (avatarNumber === 1) {
      if (this.elements.avatar1.classList.contains('avatar')) {
        this.elements.avatar1.classList.remove('avatar');
      } else {
        this.elements.avatar1.classList.add('avatar');
        this.elements.avatar2.classList.remove('avatar');
        this.elements.avatar3.classList.remove('avatar');
        this.elements.avatar4.classList.remove('avatar');
      }
    } else if (avatarNumber === 2) {
      this.elements.avatar2 = document.getElementById('avatar2');
      if (this.elements.avatar2.classList.contains('avatar')) {
        this.elements.avatar2.classList.remove('avatar');
      } else {
        this.elements.avatar2.classList.add('avatar');
        this.elements.avatar1.classList.remove('avatar');
        this.elements.avatar3.classList.remove('avatar');
        this.elements.avatar4.classList.remove('avatar');
      }
    } else if (avatarNumber === 3) {
      this.elements.avatar3 = document.getElementById('avatar3');
      if (this.elements.avatar3.classList.contains('avatar')) {
        this.elements.avatar3.classList.remove('avatar');
      } else {
        this.elements.avatar3.classList.add('avatar');
        this.elements.avatar1.classList.remove('avatar');
        this.elements.avatar2.classList.remove('avatar');
        this.elements.avatar4.classList.remove('avatar');
      }
    } else if (avatarNumber === 4) {
      this.elements.avatar4 = document.getElementById('avatar4');
      if (this.elements.avatar4.classList.contains('avatar')) {
        this.elements.avatar4.classList.remove('avatar');
      } else {
        this.elements.avatar4.classList.add('avatar');
        this.elements.avatar1.classList.remove('avatar');
        this.elements.avatar2.classList.remove('avatar');
        this.elements.avatar3.classList.remove('avatar');
      }
    }
  }
}
