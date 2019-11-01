import { ItemViewModel } from '../models/item.view-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class NestMongoService extends BaseService {

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  public selectedItem: ItemViewModel;
  public postItem: ItemViewModel;
  public itemSubject = new Subject<ItemViewModel>();


  getItems(): Observable<ItemViewModel[]> {
    return this.http.get<ItemViewModel[]>(`${this.API_URL}/item`);
  }

  getItemsById(id: number): Observable<ItemViewModel[]> {
    return this.http.get<ItemViewModel[]>(`${this.API_URL}/item/${id}`);
  }

  postItems(data: ItemViewModel): Observable<ItemViewModel> {
    const result = this.http.post<ItemViewModel>(`${this.API_URL}/item`, data);
    return result;
  }

  deleteItemId(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/item/${id}`);
  }

  updateItem(data: ItemViewModel): Observable<ItemViewModel> {
    return this.http.put<ItemViewModel>(`${this.API_URL}/item/${data.id}`, data);
  }
}
