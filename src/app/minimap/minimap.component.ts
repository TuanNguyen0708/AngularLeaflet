import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';

@Component({
  selector: 'app-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.css']
})
export class MinimapComponent implements AfterViewInit {
  
  @Output() changeBaseMap = new EventEmitter()
  @Input() map:any

  constructor() { }

  ngAfterViewInit() {
  }
  satelliteClick() {
    this.changeBaseMap.emit(1)
  }
  hybirdClick() {
    this.changeBaseMap.emit(2)
  }


}
