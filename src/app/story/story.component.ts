import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd';
import { AudioService } from '../core/audio.service';
@Component({
  selector: 'app-story',
  template: ` <div class="tool-bar">
    <nz-upload
      [nzDirectory]="true"
      [(nzFileList)]="fileList"
      [nzBeforeUpload]="beforeUpload"
    >
      <button nz-button (click)="clearFileList()">
        <i nz-icon nzType="upload"></i>选择-文-文件夹
      </button>
    </nz-upload>

    <button nz-button (click)="handleUpload()">
      {{ uploading ? '上传中.' : '开始上传' }}
    </button>
  </div>`,
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {
  fileList: NzUploadFile[] = [];

  uploading = false;

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  clearFileList(): void {
    this.fileList = [];
  }

  handleUpload() {
    this.uploading = true;

    this.audioService.uploadStories(this.fileList).subscribe(() => {
      this.uploading = false;
      this.clearFileList();
    });
  }
}
