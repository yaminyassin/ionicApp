import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-popover-categories',
  templateUrl: './popover-categories.component.html',
  styleUrls: ['./popover-categories.component.scss'],
})
export class PopoverCategories implements OnInit {
  
  categoryList:any;

  constructor(private popoverController:PopoverController,
              private service:ServiceService) { 
                this.categoryList = [];
              }

  ngOnInit() {
    this.service.getCategories().subscribe((categories) =>{
      let data:any = categories;
      
      data.forEach( category =>{
        this.categoryList.push(category.category);
      });
    })
  }


  clickCat(value:string){
    this.popoverController.dismiss(value);
  }
}
