import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-popover-categories',
  templateUrl: './popover-categories.component.html',
  styleUrls: ['./popover-categories.component.scss'],
})
export class PopoverCategories implements OnInit {

  constructor(private popoverController:PopoverController) { }

  ngOnInit() {}


  clickCat(value:string){
    this.popoverController.dismiss(value);
  }
}
