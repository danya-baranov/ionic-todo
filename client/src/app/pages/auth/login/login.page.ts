import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../../../app-routing.module';
import { RouteConstants } from 'src/app/constans-routing';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,

  ) {
  }

  ngOnInit() {
  }

  login(form) {
    this.authService.login(form.value).subscribe(res => {
      if (res.status === 200) {
        this.router.navigateByUrl(RouteConstants.homePage);
      } else if (res.status === 404) {
        alert('Wrong email or password');
      }
    });
  }

  navigateToRegistration() {
    this.router.navigate([RouteConstants.registerPage]);
  }
}
