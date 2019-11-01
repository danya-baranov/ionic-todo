import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  API_URL: string;

  constructor() {

    this.API_URL = 'http://10.10.1.55:3000';
  }
}
