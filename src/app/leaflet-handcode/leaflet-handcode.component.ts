import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-leaflet-handcode',
  templateUrl: './leaflet-handcode.component.html',
  styleUrls: ['./leaflet-handcode.component.css']
})

export class LeafletHandcodeComponent implements AfterViewInit, OnInit {

  map:any; 
  param:any = [];
  value:any
  tileMap: any={ };
  circle:any;
  polygon:any;
  polyline:any;
  // featureGroup: any

  constructor() {}
  ngOnInit() {
    // this.FeatureGroup()
  }
  ngAfterViewInit(){
    this.initMap();
  }


  initMap(){
    this.map =  L.map('map', {
      center: [ 10.70649049256301, 106.53974533081056 ],
      zoom: 13,
    });
    this.tileMap['1'] = L.tileLayer('https://maps.vietmap.vn/tm/{z}/{x}/{y}@2x.png?apikey=95f852d9f8c38e08ceacfd456b59059d0618254a50d3854c', {
      maxZoom: 22,
      minZoom: 5,
      maxNativeZoom: 20
    });
    this.tileMap['1'].addTo(this.map);
    this.tileMap['2'] = L.tileLayer('https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
      maxZoom: 22,
      minZoom: 5,
      maxNativeZoom: 20
    });
   
    this.tileMap['3'] = L.tileLayer('https://maps.vnpost.vn/api/hm/{z}/{x}/{y}@2x.png?apikey=7cb80a390b89d5fefae75fc58b01d01dd04a15bb62b3b141', {
      maxZoom: 22,
      minZoom: 5,
      maxNativeZoom: 20
    });
    // this.circleMap();
    // this.polygonMap();
    // this.polylineMap();
  }
  
  // FeatureGroup() {
  //   this.featureGroup = new L.FeatureGroup([this.polygon, this.polyline, this.circle]).bindPopup('Hello world!')
  //   .on('click', function() { alert('Clicked on a member of the group!'); })
  //   .addTo(this.map);
  // }

  circleMap():void {
    this.circle =  L.circle([ 10.724284977024212, 106.5557098388672 ], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    });
    this.circle.addTo(this.map)
    this.circle.bindPopup("hello, i'm L.circle");
  }
  polygonMap():void {
    this.polygon = L.polygon([
      [10.7121409871872, 106.57287597656251 ],
      [10.692490305822185, 106.55296325683595],
      [10.696285601021225, 106.57442092895509 ]
    ]);
    this.polygon.addTo(this.map)
    this.polygon.bindPopup("hello, i'm polygon");
  }
   polylineMap():void {
    this.polyline = L.polyline([[10.758184367073325, 106.508846282959],
      [10.747981219652846, 106.51451110839845],
      [10.726561920866134, 106.48635864257814 ],
      [10.713237339606419, 106.50558471679689 ],
      [10.703201350159523, 106.5256690979004 ],
      [10.704382072052141, 106.55030250549316 ],
    ])
    this.polyline.addTo(this.map)
    this.polyline.bindPopup("hello, i'm polyline");
  }
  click(param:any){
    if(param == 1){
      if(this.map.hasLayer(this.tileMap['2'])) this.map.removeLayer(this.tileMap['2'])
      if(this.map.hasLayer(this.tileMap['3'])) this.map.removeLayer(this.tileMap['3'])
      this.map.addLayer(this.tileMap['1'])
    } else if (param == 2){
      if(this.map.hasLayer(this.tileMap['1'])) this.map.removeLayer(this.tileMap['1'])
      if(this.map.hasLayer(this.tileMap['3'])) this.map.removeLayer(this.tileMap['3'])
      this.map.addLayer(this.tileMap['2'])
    } else {
      if(this.map.hasLayer(this.tileMap['2'])) this.map.removeLayer(this.tileMap['2'])
      if(this.map.hasLayer(this.tileMap['1'])) this.map.removeLayer(this.tileMap['1'])
      this.map.addLayer(this.tileMap['3'])
    }
  }
  cities(target:any,value:any) {
    const checked = target.checked;
    if(checked){
      if(value == 4 ){
        this.circleMap()
        this.map.addLayer(this.circle)
       } 
    }else{
      if(value == 4 ){
        this.map.removeLayer(this.circle)
       } 
    }
    if(checked){
      if(value == 5 ){
        this.polygonMap()
        this.map.addLayer(this.polygon)
       } 
    }else{
      if(value == 5 ){
        this.map.removeLayer(this.polygon)
       } 
    }
    if(checked){
      if(value == 6 ){
        this.polylineMap()
        this.map.addLayer(this.polyline)
       } 
    }else{
      if(value == 6 ){
        this.map.removeLayer(this.polyline)
       } 
    }
  }
   
    

}
