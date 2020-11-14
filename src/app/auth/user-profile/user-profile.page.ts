import {Component, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';
import {User} from '../user.model';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  userD: User;
  private usersSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.usersSub = this.authService.userData.subscribe((user) => {
      this.userD = user;
    });
  }




}
