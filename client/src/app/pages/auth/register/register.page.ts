import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutingModule } from '../../../app-routing.module';
import { RouteConstants } from 'src/app/constans-routing';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
  }

  register(form) {
    this.authService.register(form.value).subscribe(res => {

      this.router.navigateByUrl(RouteConstants.loginPage);
    });
  }


  navigateToLogin() {
    this.router.navigate([RouteConstants.loginPage]);
  }

}
