import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.storage.get('ACCESS_TOKEN').then(res => {
        console.log(res);
        if (res === null) {
          this.router.navigateByUrl('login');
          this.splashScreen.hide();
        } else {
          this.router.navigateByUrl('home');
          this.splashScreen.hide();
        }
      });
      this.statusBar.styleDefault();
    });
  }
}
