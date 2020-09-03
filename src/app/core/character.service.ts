import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { HttpClient } from '@angular/common/http';
import { Observable, zip, Subject, observable } from 'rxjs';
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
    let upload$ = new Subject();
    this.addAudios()
      .pipe(
        map((reps: any) => {
          for (const rep of reps) {
            this.files[rep.name].idList!.push(rep.id);
          }
          return reps;
        })
      )
      .subscribe(() => {
        this.relateAudiosAndCharacters().subscribe(() => {
          upload$.next(false);
        });
      });

    return upload$;
  }

  addAudios(): Observable<any> {
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

    return zip(...reqArray);
  }

  relateAudiosAndCharacters(): Observable<any> {
    const reqArray = [];
    for (const name in this.files) {
      if (Object.prototype.hasOwnProperty.call(this.files, name)) {
        const audioFiles: any = this.files[name];

        reqArray.push(
          this.http.post(
            '/characters',
            JSON.stringify({ audios: audioFiles.idList, name: name })
          )
        );
      }
    }

    return zip(...reqArray);
  }
}
