import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ListService} from '../../list/list.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogIn(logInForm: NgForm){
    console.log(logInForm);
    if (logInForm.valid)
    {
      this.loadingCtrl.create({message: 'Signing in...'}).then(loadingEl => {
        loadingEl.present();
        this.authService.logIn(logInForm.value).subscribe(resData => {
        console.log('ulogovan');
        console.log(resData);
        loadingEl.dismiss();
        this.router.navigateByUrl( '/home');
      }); });
    }
  }

}
