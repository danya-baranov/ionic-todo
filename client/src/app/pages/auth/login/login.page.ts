import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,

  ) { }

  ngOnInit() {
  }

  login(form) {
    this.authService.login(form.value).subscribe(res => {
      if (res.status === 200) {
        this.router.navigateByUrl('home');
      } else if (res.status === 404) {
        alert('Wrong email or password');
      }
    });
  }

  navigateToRegistration() {
    this.router.navigate(['/register']);
  }
}
