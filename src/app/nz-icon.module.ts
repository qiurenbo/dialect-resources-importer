import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';

import {
  UserOutline,
  LaptopOutline,
  NotificationOutline,
  DeleteOutline,
  DownloadOutline,
} from '@ant-design/icons-angular/icons';
import { NgModule } from '@angular/core';

const icons: IconDefinition[] = [
  UserOutline,
  LaptopOutline,
  NotificationOutline,
  DeleteOutline,
  DownloadOutline,
];

@NgModule({
  imports: [NzIconModule.forRoot(icons)],
})
export class IconModule {}
