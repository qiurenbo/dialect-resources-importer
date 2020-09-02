import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { HttpClient } from '@angular/common/http';
import { Observable, zip, forkJoin, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { NzUploadFile } from 'ng-zorro-antd/upload';
export class AudioFile {
  sex: string;
  age: string;
  author: string;
  audio: File;
  name: string;
  region: string;
  file: NzUploadFile;
}
export class UploadFile {
  [key: string]: any;
}
@Injectable({ providedIn: CoreModule })
export class CharacterService {
  files: UploadFile;

  constructor(private http: HttpClient) {}

  addCharacters(files: UploadFile): Observable<any> {
    this.files = files;

    // first post audio and then relate audio and current characters
    return forkJoin(concat(this.addAudios(), this.relateAudiosAndCharacters()));
  }

  private addAudios(): Observable<any> {
    const reqArray = [];
    for (const name in this.files) {
      if (Object.prototype.hasOwnProperty.call(this.files, name)) {
        const audioFiles: any = this.files[name];
        // store post audio id by response
        audioFiles.idList = [];
        for (let audioFile of audioFiles) {
          const formData = new FormData();
          formData.append(
            'data',
            JSON.stringify({
              name: audioFile.name,
              author: audioFile.author,
              sex: audioFile.sex,
              age: audioFile.age,
              region: audioFile.region,
            })
          );
          formData.append('files.audio', audioFile.file);

          reqArray.push(this.http.post('/audios', formData));
        }
      }
    }

    return zip(...reqArray).pipe(
      map((reps: any) => {
        for (const rep of reps) {
          if (!this.files[rep.name].idList) {
            this.files[rep.name].idList = [];
          }
          this.files[rep.name].idList.push(rep.id);
        }
        return reps;
      })
    );
  }

  private relateAudiosAndCharacters() {
    const reqArray = [];
    for (const name in this.files) {
      if (Object.prototype.hasOwnProperty.call(this.files, name)) {
        const audioFiles: any = this.files[name];

        reqArray.push(
          this.http.post(
            '/audios',
            this.http.post(
              '/characters',
              JSON.stringify({ audios: audioFiles.idList, name: name })
            )
          )
        );
      }
    }

    return forkJoin(...reqArray);
  }
}
