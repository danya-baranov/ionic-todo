import { Photo } from './../models/photo.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImgNestService {

  API_URL = 'http://10.10.1.55:3000/item';

  constructor(private httpClient: HttpClient) { }

  uploadFile(files: any, id: number): Observable<any> {
    const data = new FormData();
    data.append('file', files);
    return this.httpClient.post<any[]>(`${this.API_URL}/upload/${id}`, data);
  }

  getPhoto(): Observable<Photo[]> {
    return this.httpClient.get<Photo[]>(`${this.API_URL}/getPhotos`);
  }

  getPhotoById(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/getPhotos/${id}`);
  }

  deletePhoto(id: string, namePhoto: any): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/deletePhotos/${id}`, {
      namePhoto
    });
  }

  deleteNotePhotos(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/deletePhotos/${id}`);
  }

  addNameForDeletePhoto(namePhoto: any[]): Observable<any[]> {
    const result = this.httpClient.post<any[]>(this.API_URL, namePhoto);
    return result;
  }


}
