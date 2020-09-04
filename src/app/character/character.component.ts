import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  CharacterService,
  AudioFile,
  UploadFile,
} from '../core/character.service';

@Component({
  selector: 'app-character',
  template: `
    <div class="tool-bar">
      <nz-upload
        [nzDirectory]="true"
        [(nzFileList)]="fileList"
        [nzBeforeUpload]="beforeUpload"
      >
        <button nz-button (click)="clearFileList()">
          <i nz-icon nzType="upload"></i>选择文件夹
        </button>
      </nz-upload>

      <button nz-button (click)="handleUpload()">
        {{ uploading ? '上传中.' : '开始上传' }}
      </button>
    </div>
  `,
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent implements OnInit {
  fileList: NzUploadFile[] = [];
  audioFileList: AudioFile[] = [];

  uploading = false;

  constructor(private chService: CharacterService) {}

  ngOnInit(): void {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  clearFileList(): void {
    this.fileList = [];
  }

  createAudioFile(file: NzUploadFile) {
    const audioFile = new AudioFile();
    const names = file.name.split('+');

    audioFile.region = names[0];
    audioFile.author = names[1];
    audioFile.sex = names[2];
    audioFile.age = names[3];
    audioFile.name = names[4].split('.')[0];
    audioFile.file = file;

    return audioFile;
  }

  handleUpload() {
    let uploadFileList = new UploadFile();
    this.fileList.forEach((file) => {
      console.log(file);
      let audioFile = this.createAudioFile(file);
      if (!uploadFileList[audioFile.name]) {
        uploadFileList[audioFile.name] = [];
      }
      uploadFileList[audioFile.name].push(audioFile);
    });

    this.uploading = true;
    this.chService.addCharacters(uploadFileList).subscribe(() => {
      this.uploading = false;
    });
  }
}
