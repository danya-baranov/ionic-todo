import { AuthService } from './../../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Item } from 'src/app/models/item.model';
import { NestMongoService } from 'src/app/services/item.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  items: Item[];

  constructor(
    public modalController: ModalController,
    private itemService: NestMongoService,
    private router: Router,
    private authService: AuthService
  ) {
    this.itemService.itemSubject.subscribe((res) => {
      this.items.push(res);
    });
  }

  ngOnInit() {
    this.getAll();
  }

  doRefresh(event) {
    this.getAll();
    event.target.complete();
  }

  getAll() {
    this.itemService.getItems()
      .subscribe(response => {
        this.items = response;
      });
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigateByUrl('login');
  }

  add() {
    this.router.navigate(['item-details']);
  }

  async edit(item: Item) {
    this.itemService.selectedItem = item;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit: true,
      }
    };
    await this.router.navigate(['item-details'], navigationExtras);
  }


  delete(item: Item) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      this.itemService.deleteItemId(item.id).subscribe();
      return;
    }
  }

  autoClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }
}
