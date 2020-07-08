import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromosPageRoutingModule } from './promos-routing.module';

import { PromosPage } from './promos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromosPageRoutingModule
  ],
  declarations: [PromosPage]
})
export class PromosPageModule {}
