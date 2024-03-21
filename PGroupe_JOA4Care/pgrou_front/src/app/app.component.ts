import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthentificationService } from './authentification/authentification.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  exhaustMap,
  map,
  take,
} from 'rxjs';
import { Router } from '@angular/router';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Activite } from './activites/activite.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  // @ts-ignore
  private userSub: Subscription;
  users?: any;
  ids: (string | undefined)[] = [];
  uids: string[] = [];
  id_user: string | undefined;
  // userAvatar: Avatar | undefined;
  userAvatar: any;

  constructor(
    private authentificationService: AuthentificationService,
    private router: Router,
    private db: AngularFireDatabase
  ) {}
  title = 'JOA 4 CARE';

  ngOnInit() {
    this.userSub = this.authentificationService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    if(localStorage.getItem('userData')){
    }
    else if (!this.isAuthenticated) {
      this.router.navigate(['/authentification']);
    }


    this.authentificationService.autoLogin();
    this.userAvatar = localStorage.getItem('avatar')
    console.log(this.userAvatar)
  }
  

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  onLogout() {
    this.authentificationService.logout();
  }
}
