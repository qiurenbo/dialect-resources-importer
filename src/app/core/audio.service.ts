import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, zip, concat, forkJoin } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { map, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
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

@Injectable()
export class AudioService {
  constructor(private http: HttpClient) {}

  /**
   * Upload audio files first and record audio id in idList
   * @param files audio files to be uploaded
   */
  private addAudios(files: any): Observable<any> {
    const reqArray = [];
    for (const name in files) {
      if (Object.prototype.hasOwnProperty.call(files, name)) {
        const audioFiles: any = files[name];
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

          reqArray.push(
            this.http.post(`${environment.apiEndPoint}/audios`, formData).pipe(
              map((rep: any) => {
                console.log(rep);
                files[rep.name].idList!.push(rep.id);
                console.log(files[rep.name]);
                return rep;
              })
            )
          );
        }
      }
    }

    return forkJoin(concat(...reqArray));
  }

  /**
   * According idList to upload item infos
   * @param files
   * @param endpoint uploaded endpoint
   */
  private relateAudiosAndItems(files: any, endpoint: string): Observable<any> {
    const reqArray = [];
    console.log('关联...');
    for (const name in files) {
      if (Object.prototype.hasOwnProperty.call(files, name)) {
        const audioFiles: any = files[name];
        console.log('关联 name:' + name + ':' + endpoint);
        console.log(audioFiles);
        reqArray.push(
          this.http
            .post(
              endpoint,
              JSON.stringify({ audios: audioFiles.idList, name: name })
            )
            .pipe(
              map((rep: any) => {
                console.log(rep);
                console.log('上传成功');
                return rep;
              })
            )
        );
      }
    }

    return zip(...reqArray);
  }

  /**
   * Pack file to audioFile
   * @param file
   */
  private createAudioFile(file: NzUploadFile) {
    const audioFile = new AudioFile();
    const names = file.name.replace(/＋/g, '+').split('+');

    if (names.length != 5) {
      console.log(names);
      throw 'audio error';
    }

    audioFile.region = names[0];
    audioFile.author = names[1];
    audioFile.sex = names[2];
    audioFile.age = names[3];
    audioFile.name = names[4].split('.')[0];
    audioFile.file = file;

    return audioFile;
  }

  /**
   * Parse fileList and make audios with same name into one object
   * @param fileList upload fileList inherit from web fileList
   */
  private parse(fileList: NzUploadFile[]) {
    let uploadFileList = new UploadFile();
    for (const file of fileList) {
      try {
        let audioFile = this.createAudioFile(file);
        if (!uploadFileList[audioFile.name]) {
          uploadFileList[audioFile.name] = [];
        }
        uploadFileList[audioFile.name].push(audioFile);
      } catch {
        console.log('skip unSupport audio');
      }
    }

    return uploadFileList;
  }

  uploadWords(fileList: NzUploadFile[]) {
    return this.proxy(this.parse(fileList), `${environment.apiEndPoint}/words`);
  }

  uploadSentences(fileList: NzUploadFile[]) {
    return this.proxy(
      this.parse(fileList),
      `${environment.apiEndPoint}/sentences`
    );
  }

  uploadStories(fileList: NzUploadFile[]) {
    return this.proxy(
      this.parse(fileList),
      `${environment.apiEndPoint}/stories`
    );
  }

  uploadSongs(fileList: NzUploadFile[]) {
    return this.proxy(this.parse(fileList), `${environment.apiEndPoint}/songs`);
  }

  private proxy(files: any, endpoint: string) {
    return this.addAudios(files).pipe(
      switchMap(() => this.relateAudiosAndItems(files, endpoint))
    );
  }
}
