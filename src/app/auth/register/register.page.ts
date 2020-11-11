import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {ListService} from '../../list/list.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.registerForm = new FormGroup( {
      name: new FormControl('Kristina', Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)])
    });
  }

  onRegister() {
    console.log(this.registerForm);
    this.loadingCtrl.create({message: 'Signing up...'}).then(loadingEl => {
      loadingEl.present();
      this.authService.register(this.registerForm.value).subscribe(resData => {
      console.log('registrovan');
      console.log(resData);
      loadingEl.dismiss();
    });

      this.router.navigateByUrl( '/log-in');
    });
  }
}
