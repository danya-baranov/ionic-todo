import { RouteConstants } from './../../constans-routing';
import { AppRoutingModule } from './../../app-routing.module';
import { AddressViewModel } from './../../models/address.view-model';
import { BaseService } from './../../services/base.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemViewModel, ItemViewModelGeo } from 'src/app/models/item.view-model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UploadImgNestService } from '../../services/upload-img-nest.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Storage } from '@ionic/storage';
import {
  ToastController,
  Platform
} from '@ionic/angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsAnimation,
  MyLocation,
  GoogleMapOptions,
  LatLng
} from '@ionic-native/google-maps';

import {
  NativeGeocoder,
} from '@ionic-native/native-geocoder/ngx';
import { NestMongoService } from 'src/app/services/item.service';



@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})

export class ItemDetailsPage implements OnInit {

  @Input() item: ItemViewModel;

  checked: false;
  photos = [];
  position: ItemViewModelGeo;

  map: GoogleMap;
  address: AddressViewModel;

  sliceSize: number;

  quality: number;
  targetHeight: number;
  targetWidth: number;
  zoom: number;

  private editMode: boolean = !!this.route.snapshot.queryParams.edit;
  constructor(
    public modalController: ModalController,
    public camera: Camera,
    public uploadImgNestService: UploadImgNestService,
    public photoViewer: PhotoViewer,
    public toastCtrl: ToastController,
    public platform: Platform,
    public nativeGeocoder: NativeGeocoder,
    public router: Router,
    private storage: Storage,
    private route: ActivatedRoute,
    private itemService: NestMongoService,
    private baseService: BaseService
  ) {
    this.uploadPhoto();
  }

  ngOnInit() {
    if (this.editMode) {
      this.item = this.itemService.selectedItem;
    }
    if (!this.editMode) {
      this.initItemDefaultValues();
    }
    console.log(this.item.latLng);
    this.storage.get('USER_ID').then(id => {
      this.item.userId = id;
    });
    this.platform.ready();
    this.loadMap();
    this.initAddressDefaultValues();
    this.sliceSize = 512;
    this.zoom = 15;
    this.initCamearaDefaultOptions();
  }


  onSubmit() {
    if (this.editMode) {
      this.itemService.updateItem(this.item).subscribe((res) => {
        console.log(res);
      });
    } else {
      this.itemService.postItems(this.item).subscribe(res => {
        this.itemService.itemSubject.next(res);
      });
    }
    this.router.navigate([RouteConstants.homePage]);
  }

  async close() {
    this.router.navigate([RouteConstants.homePage]);
    const undef = this.item.photos;
    await undef.forEach((del: { itemId: string; _id: string; photo: any; }) => {
      if (del.itemId === 'undefined') {
        this.uploadImgNestService.deletePhoto(del._id, del.photo).subscribe();
      }
    });
  }

  toggleChange(event: { detail: { checked: false; }; }) {
    this.item.completed = event.detail.checked;
    this.checked = event.detail.checked;
  }


  loadMap() {
    const options: GoogleMapOptions = {
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: true,
        mapToolbar: true,
        zoom: true,
      }
    };
    this.map = GoogleMaps.create('map_canvas', options);
    if (this.item.latLng.lat === 0 && this.item.latLng.lng === 0) {
      this.goToMyLocation();
    } else {
      this.map.animateCamera({
        target: this.item.latLng,
        zoom: 15,
      });
      const nextMarker = this.map.addMarkerSync({
        title: 'You are here',
        icon: 'red',
        animation: GoogleMapsAnimation.BOUNCE,
        position: this.item.latLng,
      });
      nextMarker.showInfoWindow();
    }
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((params: any[]) => {
      this.map.clear();

      const geo: LatLng = params[0];
      console.log(geo);
      this.item.latLng.lat = geo.lat;
      this.item.latLng.lng = geo.lng;
      this.map.addMarkerSync({
        position: this.item.latLng,
        target: this.item.latLng,
        title: 'You are here',
        animation: GoogleMapsAnimation.BOUNCE,
      });
    });
  }

  async goToMyLocation() {
    await this.map.getMyLocation().then((location: MyLocation) => {
      this.item.latLng = location.latLng;
      this.map.animateCamera({
        target: this.item.latLng,
        zoom: this.zoom,
      });
      const marker = this.map.addMarkerSync({
        title: 'You are here',
        position: this.item.latLng,
        animation: GoogleMapsAnimation.BOUNCE,
      });
      marker.showInfoWindow();
    });
  }

  showPhoto(img: string) {
    this.photoViewer.show(img, 'Photo');
  }

  uploadPhoto() {
    this.uploadImgNestService.getPhoto()
      .subscribe(res => {
        res.forEach(element => {
          if (element.itemId === this.item.id) {
            const path = `${this.baseService.API_URL}/uploads/` + element.photo;
            this.photos.unshift(path);
          }
        });
      });
  }

  deleteFile(photo: string) {
    console.log(photo);
    const index = this.photos.indexOf(photo);
    console.log(index);
    if (index > -1) {
      this.photos.splice(index, 1);
    }
    this.uploadImgNestService.getPhoto()
      .subscribe(res => {
        res.forEach(el => {
          if (photo.indexOf(el.photo) > -1) {
            this.uploadImgNestService.deletePhoto(el._id, el.photo).subscribe();
          }
        });
      });
  }

  async addPhoto() {
    const options: CameraOptions = {
      quality: this.quality,
      targetHeight: this.targetHeight,
      targetWidth: this.targetWidth,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
    };

    await this.camera.getPicture(options).then(img => {
      const blob = this.getBlob(img, 'image/jpeg');
      console.log(blob);
      this.uploadImgNestService.uploadFile(blob, this.item.id).subscribe(res => {
        const path = `${this.baseService.API_URL}/uploads/` + res.result.photo;
        this.photos.unshift(path);
        this.item.photos.push(res.result);
      });
    });
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: this.quality,
      targetHeight: this.targetHeight,
      targetWidth: this.targetWidth,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
    };
    await this.camera.getPicture(options).then((img) => {
      const blob = this.getBlob(img, 'image/jpeg');
      this.uploadImgNestService.uploadFile(blob, this.item.id).subscribe((res) => {
        const path = `${this.baseService.API_URL}/uploads/` + res.result.photo;
        this.photos.unshift(path);
        this.item.photos.push(res.result);
      });
    });
  }

  private getBlob(b64Data: string, contentType: string, sliceSize: number = this.sliceSize) {
    contentType = contentType;
    sliceSize = sliceSize;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
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

  private initItemDefaultValues() {
    this.item = {
      title: '',
      text: '',
      photos: [],
      completed: false,
      latLng: {
        lat: 0,
        lng: 0,
      },
      userId: '',
    };
  }

  private initCamearaDefaultOptions() {
    this.quality = 100;
    this.targetHeight = 200;
    this.targetWidth = 200;
  }

}
