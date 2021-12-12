import { Component, OnInit } from '@angular/core';
// import * as L from 'leaflet';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';


declare var require: any
declare let L:any;
@Component({
    selector: 'app-leaflet',
    templateUrl: './leaflet.component.html',
    styleUrls: ['./leaflet.component.css']
})

export class LeafletComponent implements OnInit {


    // arrMarker: Array<any> = [
    //   {"x" : 10.794019130536723, "y" : 106.71415328979494 ,"name": "Tp.HCM", "address": "Quận 1", "id" : 1},
    //   {"x" : 10.79511518544009, "y" :  106.70745849609376 ,"name": "Tp.HCM", "address": "Quận 2", "id" : 2},
    //   {"x" : 10.793091696342358, "y" : 106.69715881347658 ,"name": "Tp.HCM", "address": "Quận 3", "id" : 3},
    //   {"x" : 10.778168043677475, "y" : 106.7011070251465 ,"name": "Tp.HCM", "address": "Quận 4", "id" : 4},
    //   {"x" : 10.77606012346712, "y" :  106.69089317321779 ,"name": "Tp.HCM", "address": "Quận 5", "id" : 5},
    //   {"x" : 10.769483317557109, "y" : 106.68771743774415 ,"name": "Tp.HCM", "address": "Quận 6", "id" : 6},
    //   {"x" : 10.76450845871857 , "y" : 106.68600082397462 ,"name": "Tp.HCM", "address": "Quận 7", "id" : 7},
    //   {"x" : 10.763496612971204 , "y" : 106.69398307800294 ,"name": "Tp.HCM", "address": "Quận 8", "id" : 8},
    //   {"x" : 10.76147291128591 , "y" : 106.70119285583498 ,"name": "Tp.HCM", "address": "Quận 9", "id" : 9},
    //   {"x" : 10.759870804483496 , "y" : 106.68934822082521 ,"name": "Tp.HCM", "address": "Quận 10", "id" : 10},
    //   {"x" : 10.76383389526445 , "y" : 106.66033744812013 ,"name": "Tp.HCM", "address": "Quận 11", "id" : 11},
    //   {"x" : 10.773361964060282 , "y" : 106.64308547973634 ,"name": "Tp.HCM", "address": "Quận 12", "id" : 12},
    //   {"x" : 10.790562315812565 , "y" : 106.63681983947754 ,"name": "Tp.HCM", "address": "Quận 13", "id" : 13},
    //   {"x" : 10.784913289130628 , "y" : 106.61845207214357 ,"name": "Tp.HCM", "address": "Quận 14", "id" : 14},
    //   {"x" : 10.784154456566759 , "y" : 106.59956932067873 , "name": "Tp.HCM", "address": "Quận 15","id" : 15},
    //   {"x" : 10.777409194102281 , "y" : 106.59072875976564 ,"name": "Tp.HCM", "address": "Quận 16", "id" : 16},
    //   {"x" : 22.3884335025448 , "y" : 105.368108174232 ,"name": "Tp.Hà Nội", "address": "Quận Hoàn Kiếm", "id" : 17},
    // ]


    visibleSidebar1: any;
    visibleSidebar2: any;
    visibleSidebar3: any;
    visibleSidebar4: any;
    visibleSidebar5: any;
    markerSelected: any;

    map!: L.Map
    VietMap: any;
    satellite: any;
    hybird: any;
    circleMap: any;
    polygonMap: any;
    polylineMap: any;
    featureGroup: any;
    dataSearch: any[] = []
    dataRouting:any;
    drawPolyline:any;
    polylineDecode:any;
    printMarkerLocation:any
    startPoint:any;
    endPoint:any;
    arrMarker:any[] = []
    id:number = 0



    ngOnInit() {
        this.initMap();
    }

    constructor(private apiService: ApiService) { }
    public initMap(): void {
        //hàm này để tạo layer
        this.VietMap = L.tileLayer('https://maps.vietmap.vn/tm/{z}/{x}/{y}@2x.png?apikey=95f852d9f8c38e08ceacfd456b59059d0618254a50d3854c', {
            maxZoom: 22,
            minZoom: 5,
            maxNativeZoom: 20
        });
        this.satellite = L.tileLayer('https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
            maxZoom: 22,
            minZoom: 5,
            maxNativeZoom: 20
        });
        this.hybird = L.tileLayer('https://maps.vnpost.vn/api/hm/{z}/{x}/{y}@2x.png?apikey=7cb80a390b89d5fefae75fc58b01d01dd04a15bb62b3b141', {
            maxZoom: 22,
            minZoom: 5,
            maxNativeZoom: 20
        });

        this.map = L.map('map', { zoomControl: false }).setView([10, 106], 10)
        this.VietMap.addTo(this.map)

        this.featureGroup = L.featureGroup().addTo(this.map);

        //hàm này để tạo circle
        this.circleMap = L.circle([10.724284977024212, 106.5557098388672], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).on("click", function (e:any) {
            e.target.setStyle({ fillColor: 'green', color: 'green' })
        })


        //hàm này để tạo polygon
        this.polygonMap = L.polygon([
            [10.7121409871872, 106.57287597656251],
            [10.692490305822185, 106.55296325683595],
            [10.696285601021225, 106.57442092895509]
        ]).on("click", function (e:any) {
            e.target.setStyle({ fillColor: 'green', color: 'green' })
        })

        //hàm này để tạo polyline
        this.polylineMap = L.polyline([[10.758184367073325, 106.508846282959],
        [10.747981219652846, 106.51451110839845],
        [10.726561920866134, 106.48635864257814],
        [10.713237339606419, 106.50558471679689],
        [10.703201350159523, 106.5256690979004],
        [10.704382072052141, 106.55030250549316],
        ]).on("click", function (e:any) {
            e.target.setStyle({ fillColor: 'green', color: 'green' })
        });



        // var a = this
        // for(let i = 0; i < this.arrMarker.length; i++){
        //   const arr = this.arrMarker
        //   //hàm này để tạo popup khi chúng ta click vào marker
        //   const popupClick = L.popup().setContent(
        //     `
        //     <div style="text-align: center">
        //       <p>Name: ${arr[i].name}</p>
        //       <p>Địa Chỉ: ${arr[i].address}</p>
        //       <p>Tọa Độ: (${arr[i].x}, ${arr[i].y})</p>
        //     </div>
        //     `
        //     )
        //     var app = this;
        //     //Hàm này để tạo market khi chúng ta click vào bất kì điểm này trên map
        //     this.map.on('click', function(e:any) {
        //       L.marker(e.latlng).addTo(app.map)
        //     })


        //     var icon: any
        //     const iconMap =  L.marker([arr[i].x, arr[i].y], {
        //       icon: L.icon({
        //         iconSize: [ 30, 40 ],
        //         iconAnchor: [ 15, 0 ],
        //         iconUrl: 'https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png',
        //         shadowUrl: 'leaflet/marker-shadow.png',
        //       })
        //     }).addTo(this.group)
        //     iconMap.on("click", function(e) {
        //       for(let i = 0; i < arr.length; i++){
        //       if(a.markerSelected){
        //         a.markerSelected.setIcon(
        //           L.icon({
        //             iconUrl: "https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png"
        //           })
        //         )
        //       }
        //       if(a.markerSelected = e.target){
        //       a.markerSelected.setIcon(
        //         L.icon({
        //           iconUrl: "leaflet/marker-icon.png"
        //         })
        //       )}}
        //     }).bindPopup(popupClick)
        //    icon = iconMap
        // }

        

        var a = this
      
        //Hàm này để tạo market khi chúng ta click vào bất kì điểm này trên map
        a.map.on('click', function (e: any) {
                console.log(e);
                
                // hàm này là routing map (hiểm thị đường đi giữa 2 điểm được chấm trên bản đồ)
                if(a.startPoint == null && a.endPoint == null){
                    a.startPoint = [e.latlng.lat, e.latlng.lng]
                } else if (a.startPoint !=null && a.endPoint == null){
                    a.endPoint = [e.latlng.lat, e.latlng.lng]
                }
                routerMap();
                let markers = L.marker([e.latlng.lat, e.latlng.lng], {
                    myCustomId: a.id += 1,
                    icon: L.icon({
                                iconSize: [ 30, 40 ],
                                iconAnchor: [ 15, 0 ],
                                iconUrl: 'https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png',
                                shadowUrl: 'leaflet/marker-shadow.png',
                              }),
                    draggable: true,
                }).on('click', function(e:any) {
                    console.log(e, 'e');
                    
                })
                a.arrMarker.push(markers)
                console.log(a.arrMarker);
                    
                
                markers.on('dragend', function(e:any) {
                    
                    console.log(e,'drag');
                    if(e.target.options.myCustomId == 1){
                        a.startPoint = [e.target._latlng.lat, e.target._latlng.lng]
                        markers.bindPopup("day la diem bat dau")
                    } else {
                    a.endPoint = [e.target._latlng.lat, e.target._latlng.lng]

                        markers.bindPopup("day la diem ket thuc")
                    }
                    routerMap()

                    var latlng = e.target.getLatLng();
                    console.log(latlng);
                    console.log(latlng.lat, latlng.lng)
                }).addTo(a.map)
               
        })
        
        for (let i = 0; i < 50; i++) {
            var icon: any
            // hàm này để tạo popup khi chúng ta click vào marker
            // const popupClick = L.popup().setContent(
            //   `
            //   <div style="text-align: center">
            //     <p>Tọa Độ: (${icon[i].NewClass._latlng.lat}, ${icon[i].NewClass._latlng.lng})</p>
            //   </div>
            //   `
            //   )
            //   icon.bindPopup(popupClick)
            // var app = this;
            icon = L.marker([10.794019130536723 + 0.5 * (Math.random() - 0.5), 106.71415328979494 + 0.5 * (Math.random() - 0.5)], {
                draggable: true,
                icon: L.icon({
                    iconSize: [30, 40],
                    iconAnchor: [15, 0],
                    iconUrl: 'https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png',
                    shadowUrl: 'leaflet/marker-shadow.png',
                })
            }).addTo(this.featureGroup).on("click", function (e:any) {
                for (let i = 0; i < 50; i++) {
                    if (a.markerSelected) {
                        a.markerSelected.setIcon(
                            L.icon({
                                iconUrl: "https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png"
                            })
                        )
                    }
                    if (a.markerSelected = e.target) {
                        a.markerSelected.setIcon(
                            L.icon({
                                iconUrl: "leaflet/marker-icon.png"
                            })
                        )
                    }
                }
            })
        }
        //hàm này để set view toàn bộ marker khi load lần đầu tiên vào trang web
        let bounds = this.featureGroup.getBounds();
        this.map.fitBounds(bounds);


        const BaseMap = {
            "VietMap": this.VietMap,
            "Satellite": this.satellite,
            "Hybird": this.hybird,
        };

        const cities = {
            "Circle": this.circleMap,
            "Polygon": this.polygonMap,
            "Poliline": this.polylineMap,
            "icon": this.featureGroup
        }
        L.control.layers(BaseMap, cities, bounds).addTo(this.map);

        function routerMap() {
            a.apiService.routerMap(a.startPoint, a.endPoint).pipe(
                catchError((err, caught) => {
                    return (err);
                })
            ).subscribe((res: any) => {
                console.log(res);
                if (res.code == "OK") {
                    // a.polylineDecode(res.paths);
                    let polyUtil = require('polyline-encoded');
                    let latlngs = [];
                    if (res.paths[0].points != undefined) {
                        latlngs = polyUtil.decode(res.paths[0].points);
                        console.log(latlngs);
                    }
                    a.polylineMap = L.polyline([latlngs]).addTo(a.map);


                }
            });
        }
    }



    changeBaseMap(e: number) {
        if (e == 1) {
            if (this.map.hasLayer(this.VietMap)) {
                this.map.removeLayer(this.VietMap);
            }
            if (this.map.hasLayer(this.hybird)) {
                this.map.removeLayer(this.hybird)
            }
            if (!this.map.hasLayer(this.satellite)) {
                this.map.addLayer(this.satellite)
            }
        }
        else {
            if (this.map.hasLayer(this.VietMap)) {
                this.map.removeLayer(this.VietMap);
            }
            if (this.map.hasLayer(this.satellite)) {
                this.map.removeLayer(this.satellite)
            }
            if (!this.map.hasLayer(this.hybird)) {
                this.map.addLayer(this.hybird);
            }
        }
    }

    onChangeSearch(event: any) {
        let res = event.query
        this.apiService.searchApi(res).pipe(
            catchError((err, caught) => {
                return (err);
            })
        ).subscribe((res: any) => {
            if (typeof res.Code == 'undefined') {
                let dat = {
                    refPlaceId: res.refPlaceId,
                    name: res.label,
                }
                this.dataSearch = [dat];
                console.log(dat)
            }
            else {
                if (res.Code == null) {
                    this.dataSearch = [];

                    let data = []
                    for (let item of res.Places) {
                        let dat = {
                            refPlaceId: item.refPlaceId,
                            name: item.label,
                        }
                        data.push(dat)

                    }
                    this.dataSearch = data;
                }
            }
        })

    }
    selectAdd(event: any) {
        let refPlaceId = event.refPlaceId;
        this.apiService.place(refPlaceId).pipe(
            catchError(err => (err))
        ).subscribe((res: any) => {
            if (res !== null) {
                console.log(res);
                localStorage.setItem('dataMarker', JSON.stringify(res));
                this.map.panTo([res.latitude,res.longitude])
            }
        });

    }

}






// $(function() {
//     // use below if you want to specify the path for leaflet's images
//     //L.Icon.Default.imagePath = '@Url.Content("~/Content/img/leaflet")';
  
//     var curLocation = [0, 0];
//     // use below if you have a model
//     // var curLocation = [@Model.Location.Latitude, @Model.Location.Longitude];
  
//     if (curLocation[0] == 0 && curLocation[1] == 0) {
//       curLocation = [5.9714, 116.0953];
//     }
  
//     var map = L.map('MapLocation').setView(curLocation, 10);
  
//     L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(map);
  
//     map.attributionControl.setPrefix(false);
  
//     var marker = new L.marker(curLocation, {
//       draggable: 'true'
//     });
  
//     marker.on('dragend', function(event) {
//       var position = marker.getLatLng();
//       marker.setLatLng(position, {
//         draggable: 'true'
//       }).bindPopup(position).update();
//       $("#Latitude").val(position.lat);
//       $("#Longitude").val(position.lng).keyup();
//     });
  
//     $("#Latitude, #Longitude").change(function() {
//       var position = [parseInt($("#Latitude").val()), parseInt($("#Longitude").val())];
//       marker.setLatLng(position, {
//         draggable: 'true'
//       }).bindPopup(position).update();
//       map.panTo(position);
//     });
  
//     map.addLayer(marker);
//   })