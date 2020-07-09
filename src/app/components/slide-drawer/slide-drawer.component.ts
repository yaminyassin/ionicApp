import { Component, AfterViewInit, ElementRef,
        Renderer2, Output, EventEmitter } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Gesture, GestureConfig } from '@ionic/core';

import { DatastreamService } from '../../services/datastream.service';

@Component({
  selector: 'app-slide-drawer',
  templateUrl: './slide-drawer.component.html',
  styleUrls: ['./slide-drawer.component.scss'],
})
export class SlideDrawerComponent implements AfterViewInit {
  
  //variaveis que comunicam
  @Output() state = new EventEmitter<boolean>();
  @Output() parkPicked = new EventEmitter<any>();

  parklist: any[] = [];
  drawerState:boolean;

  height: number;
  swipeHeader: any;

  constructor(
    private stream: DatastreamService,
    private getureCtrl: GestureController, 
    private element: ElementRef,
    private renderer: Renderer2)
     {
      this.drawerState =false;
      this.height = 0;
     }


  ngAfterViewInit() {
    this.Animations()
    this.stream.currentData.subscribe(data => this.parklist = data);
    console.log(this.parklist)
    this.swipeHeader = this.element.nativeElement.children[0].children[0];
  }

  private Animations(){
    const opts: GestureConfig = {
      el: this.element.nativeElement.children[0].children[0],
      direction: 'y',
      gestureName: 'slide-drawer-swipe',
      onStart: () => {
        this.renderer.setStyle(this.element.nativeElement, 'transition', 'none');
      },
      onMove: ev => {
        this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(${ev.deltaY +this.height}px)`);
      
        if(ev.deltaY < -360 - this.height)
          this.renderer.setStyle(this.element.nativeElement, 'transform', 'TranslateY(-360px)');

      },
      onEnd: ev => {
        this.renderer.setStyle(this.element.nativeElement, 'transition', '0.3s ease-out');

        
        if(ev.deltaY < -100){ //snap to top
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(-350px)`);
          this.height = -350;
          this.drawerState = true;
        }if (ev.deltaY > -100){ //snap back
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(0px)`);
          this.height = 0;
          this.drawerState = false;
          this.parklist =[];
        }if(this.parklist.length == 0){
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(0px)`);
          this.height = 0;
          this.drawerState = false;
        }
        
        //alterar state no final da animacao
        this.stateChanged(this.drawerState); 
      }
    };

    const gesture: Gesture = this.getureCtrl.create(opts);
    
    gesture.enable();
  }

  /* ------ Data sharing functions -------*/

  //Event Emitters
  private stateChanged(value:boolean){
    console.log("child sent: "+ value);
    this.state.emit(value);
  }

  public chosenPark(value: Object){
    console.log("child sent: "+ value);
    this.parkPicked.emit(value);
  }


}
