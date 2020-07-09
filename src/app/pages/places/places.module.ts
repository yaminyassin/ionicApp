import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacesPageRoutingModule } from './places-routing.module';

import { PlacesPage } from './places.page';
import { PopoverCategories } from '../../components/popover-categories/popover-categories.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacesPageRoutingModule
  ],
  declarations: [PlacesPage, PopoverCategories]
})
export class PlacesPageModule {}
