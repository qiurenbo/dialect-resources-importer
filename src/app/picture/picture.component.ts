import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PictureService } from 'src/app/core/picture.service';
@Component({
  selector: 'app-picture',
  template: ` <div class="tool-bar">
    <nz-upload
      [nzDirectory]="true"
      [(nzFileList)]="fileList"
      [nzBeforeUpload]="beforeUpload"
    >
      <button nz-button (click)="clearFileList()">
        <i nz-icon nzType="upload"></i>选择-图片-文件夹
      </button>
    </nz-upload>

    <button nz-button (click)="handleUpload()">
      {{ uploading ? '上传中.' : '开始上传' }}
    </button>
  </div>`,
  styleUrls: ['./picture.component.scss'],
})
export class PictureComponent implements OnInit {
  fileList: NzUploadFile[] = [];

  uploading = false;

  constructor(private pictureService: PictureService) {}

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

    this.pictureService.upload(this.fileList).subscribe(() => {
      this.uploading = false;
      this.clearFileList();
    });
  }
}
