import { AddressViewModel } from './../../models/address.view-model';
import { Component, OnInit } from '@angular/core';
import {
  ToastController,
  Platform
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  GoogleMapOptions,
} from '@ionic-native/google-maps';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from '@ionic-native/native-geocoder/ngx';
import { ItemViewModelGeo } from 'src/app/models/item.view-model';


@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit {

  map: GoogleMap;

  address: AddressViewModel;

  latLng: ItemViewModelGeo;

  defaultCameraZoom: number;
  defaultCameraDuration: number;
  toastCtrlDuration: number;

  constructor(
    private toastCtrl: ToastController,
    private platform: Platform,
    private nativeGeocoder: NativeGeocoder,
  ) { }

  ngOnInit() {
    this.platform.ready();
    this.loadMap();
    this.geoCoder(this.latLng.lat, this.latLng.lng);

    this.latLng = {
      lat: 0,
      lng: 0,
    };

    this.initAddressDefaultValues();
    this.defaultCameraDuration = 5000;
    this.defaultCameraZoom = 10;
    this.toastCtrlDuration = 2000;

  }


  loadMap() {
    const options: GoogleMapOptions = {
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: true,
        mapToolbar: true
      }
    };
    this.map = GoogleMaps.create('map_canvas', options);

    if (this.latLng.lat === 0 && this.latLng.lng === 0) {
      this.goToMyLocation();
    }
  }

  goToMyLocation() {
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      this.geoCoder(location.latLng.lat, location.latLng.lng);
      this.latLng.lat = location.latLng.lat;
      this.latLng.lng = location.latLng.lng;
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: this.defaultCameraZoom,
        duration: this.defaultCameraDuration
      });

      // add a marker
      const marker: Marker = this.map.addMarkerSync({
        title: 'You are here',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      marker.showInfoWindow();

      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
          console.log('Click MAP', data);
        }
      );
    })
      .catch(err => {
        this.showToast(err.error_message);
      });
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: this.toastCtrlDuration,
      position: 'middle'
    });
    toast.present();
  }

  geoCoder(lat: number, long: number) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 2,
    };
    this.nativeGeocoder.reverseGeocode(lat, long, options)
      .then((res: NativeGeocoderResult[]) => {
        console.log(res);
        this.address = {
          countryName: `${res[0].countryName}`,
          administrativeArea: `${res[0].administrativeArea}`,
          subAdministrativeArea: `${res[0].subAdministrativeArea}`,
          thoroughfare: `${res[0].thoroughfare}`,
          subLocality: `${res[0].subLocality}`,
          subThoroughfare: `${res[0].subThoroughfare}`,
        };
        console.log(this.address);
      })
      .catch(err => {
        console.log(err);
      });
  }


  private initAddressDefaultValues() {
    this.address = {
      countryName: '',
      administrativeArea: '',
      subAdministrativeArea: '',
      thoroughfare: '',
      subLocality: '',
      subThoroughfare: '',
    };
  }
}
