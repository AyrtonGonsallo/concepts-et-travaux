import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlankRoutingModule } from './blank-routing.module';
import { BlankComponent } from './blank.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';


@NgModule({
  declarations: [
    BlankComponent
  ],
  imports: [
    CommonModule,
    BlankRoutingModule,
    NzSpinModule,
  ]
})
export class BlankModule { }
