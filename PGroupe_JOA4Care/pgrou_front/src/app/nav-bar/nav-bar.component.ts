import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'] 
})
export class NavBarComponent implements OnInit {
  userAvatar: string | undefined; 
  userId: string | undefined; 

  constructor(
    private authentificationService: AuthentificationService
  ) {}

  ngOnInit() {
    this.authentificationService.user.subscribe(user => {
      this.userId = user.id; 
      this.setUserAvatar(user.id); 
    });
  }

  private setUserAvatar(userId: string) {
    this.authentificationService.fetchUsers().subscribe(users => {
      const currentUser = users.find(user => user.uid === userId); 
      if (currentUser) {
        this.userAvatar = currentUser.photo; 
      }
    });
  }

  onLogout() {
    this.authentificationService.logout();
  }
}
