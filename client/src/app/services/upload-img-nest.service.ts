import { BaseService } from './base.service';
import { PhotoViewModel } from '../models/photo.view-model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImgNestService extends BaseService {

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  uploadFile(files: any, id: number): Observable<any> {
    const data = new FormData();
    data.append('file', files);
    return this.httpClient.post<any[]>(`${this.API_URL}/item/upload/${id}`, data);
  }

  getPhoto(): Observable<PhotoViewModel[]> {
    return this.httpClient.get<PhotoViewModel[]>(`${this.API_URL}/item/getPhotos`);
  }

  getPhotoById(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/item/getPhotos/${id}`);
  }

  deletePhoto(id: string, namePhoto: any): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/item/deletePhotos/${id}`, {
      namePhoto
    });
  }

  deleteNotePhotos(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/item/deletePhotos/${id}`);
  }

  addNameForDeletePhoto(namePhoto: any[]): Observable<any[]> {
    const result = this.httpClient.post<any[]>(`${this.API_URL}/item/`, namePhoto);
    return result;
  }


}
