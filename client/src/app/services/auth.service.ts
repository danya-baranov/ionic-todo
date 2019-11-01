import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';
import { UserResponseViewModel } from '../models/user-response.view-model';
import { UserViewModel } from '../models/user.view-model';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {
    super();
   }

  authSubject = new BehaviorSubject(false);

  register(user: UserViewModel): Observable<UserResponseViewModel> {
    return this.http.post<UserResponseViewModel>(`${this.API_URL}/users/register`, user).pipe(
      tap(async (res: UserResponseViewModel) => {
        if (res) {
          await this.storage.set('ACCESS_TOKEN', JSON.stringify(res.access_token));
          await this.storage.set('USER_ID', res.user_id);
          this.authSubject.next(true);
        }
      })
    );
  }

  login(user: UserViewModel): Observable<UserResponseViewModel> {
    return this.http.post(`${this.API_URL}/users/login`, user).pipe(
      tap(async (res: UserResponseViewModel) => {
        if (res) {
          await this.storage.set('ACCESS_TOKEN', JSON.stringify(res.access_token));
          await this.storage.set('USER_ID', res.user_id);
          this.authSubject.next(true);
        }
      })
    );
  }

  async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.remove('USER_ID');
    this.authSubject.next(false);
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }

  public async getToken() {
    return await this.storage.get('ACCESS_TOKEN').then(a => {
      return JSON.parse(a);
    });
  }

}
