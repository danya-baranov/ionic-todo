import { Item } from '../models/item.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NestMongoService {

  constructor(private http: HttpClient) { }

  public selectedItem: Item;
  public postItem: Item;
  public itemSubject = new Subject<Item>();

  API_URL = 'http://10.10.1.55:3000/item';

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.API_URL);
  }

  getItemsById(id: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.API_URL}/${id}`);
  }

  postItems(data: Item): Observable<Item> {
    const result = this.http.post<Item>(this.API_URL, data);
    return result;
  }

  deleteItemId(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  updateItem(data: Item): Observable<Item> {
    return this.http.put<Item>(`${this.API_URL}/${data.id}`, data);
  }
}
