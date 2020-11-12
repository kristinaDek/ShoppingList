import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ListService} from '../../list/list.service';
import {AlertController, LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

    onLogIn(logInForm: NgForm) {
      console.log(logInForm);
      if (logInForm.valid) {
        this.loadingCtrl.create({message: 'Signing in...'}).then(loadingEl => {
          loadingEl.present();
          this.authService.logIn(logInForm.value).subscribe(resData => {
              console.log('ulogovan');
              console.log(resData);
              loadingEl.dismiss();
              this.router.navigateByUrl('/home');
            },
            errRes => {
              console.log(errRes);
              loadingEl.dismiss();
              const message = 'Incorrect email or password';

              this.alertCtrl.create(
                  {
                    header: 'Authentication failed',
                    message,
                    buttons: ['Okay']
                  }
              ).then((alert) => {
                alert.present();
              });

              logInForm.reset();
            });
      });
      }
    }
}
