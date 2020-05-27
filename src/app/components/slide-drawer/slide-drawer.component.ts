import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { Gesture, GestureConfig } from '@ionic/core';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-slide-drawer',
  templateUrl: './slide-drawer.component.html',
  styleUrls: ['./slide-drawer.component.scss'],
})
export class SlideDrawerComponent implements AfterViewInit {

  constructor(
    private getureCtrl: GestureController, 
    private element: ElementRef,
    private renderer: Renderer2) { }


  async ngAfterViewInit() {

    const opts: GestureConfig = {
      el: this.element.nativeElement,
      direction: 'y',
      gestureName: 'slide-drawer-swipe',
      onStart: () => {
        this.renderer.setStyle(this.element.nativeElement, 'transition', 'none');
      },
      onMove: ev => {
        if(ev.deltaY < 0)
        this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(${ev.deltaY}px)`);
      },
      onEnd: ev => {
        this.renderer.setStyle(this.element.nativeElement, 'transition', '0.3s ease-out');

        if(ev.deltaY >20){
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(-500px)`);
        }else{
          this.renderer.setStyle(this.element.nativeElement, 'transform', `translateY(0px)`);
        }
      }
    };

    const gesture: Gesture = await this.getureCtrl.create(opts);

    gesture.enable();
    
  }

}
