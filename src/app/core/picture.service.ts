import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, zip } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  private url = `${environment.apiEndPoint}/pictures`;
  constructor(private http: HttpClient) {}

  upload(files: any): Observable<any[]> {
    let reqQueue = [];
    for (const file of files) {
      let formData = new FormData();

      let data = { title: file.name };
      formData.append('data', JSON.stringify(data));

      // https://strapi.io/documentation/3.0.0-beta.x/plugins/upload.html#upload-file-during-entry-creation
      formData.append(`files.picture`, file, file.name);
      reqQueue.push(this.http.post(`${this.url}`, formData));
    }

    return zip(...reqQueue);
  }
}
