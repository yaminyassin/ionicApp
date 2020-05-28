import { Component, AfterViewInit, ElementRef,
   Renderer2,Input, Output, EventEmitter } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Gesture, GestureConfig } from '@ionic/core';
import { identifierModuleUrl } from '@angular/compiler';


@Component({
  selector: 'app-slide-drawer',
  templateUrl: './slide-drawer.component.html',
  styleUrls: ['./slide-drawer.component.scss'],
})
export class SlideDrawerComponent implements AfterViewInit {

  @Output() state = new EventEmitter<boolean>();

  drawerState:boolean;
  height: number;

  constructor(
    private getureCtrl: GestureController, 
    private element: ElementRef,
    private renderer: Renderer2)
     {
      this.drawerState =false;
      this.height = 0;
     }


  ngAfterViewInit() {

    const opts: GestureConfig = {
      el: this.element.nativeElement,
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
        this.renderer.setStyle(this.element.nativeElement, 'transition', '0.5s ease-out');

        if(ev.deltaY < -100){ //snap to top
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(-350px)`);
          this.height = -350;
          this.drawerState = true;
        }if (ev.deltaY > -100){ //snap back
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(0px)`);
          this.height = 0;
          this.drawerState = false;
        }
        
        this.stateChanged(this.drawerState);
      }
    };

    const gesture: Gesture = this.getureCtrl.create(opts);

    gesture.enable();
    
  }

  stateChanged(value:boolean){
    console.log(`child sent ${value}`);
    this.state.emit(value);
  }

}
