import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { InterceptorProvider } from './prodivers/interceptor';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NestMongoService } from './services/item.service';
import { ItemDetailsPage } from './pages/item-details/item-details.page';
import { UploadImgNestService } from './services/upload-img-nest.service';


@NgModule({
  declarations: [AppComponent ],
  entryComponents: [],
  imports: [
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    UploadImgNestService,
    NestMongoService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true },
    Camera,
    File,
    FilePath,
    WebView,
    Geolocation,
    LocationAccuracy,
    AndroidPermissions,
    NativeGeocoder,
    PhotoViewer,
    GooglePlus
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
