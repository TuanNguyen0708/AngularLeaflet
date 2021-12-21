import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
// import * as L from 'leaflet';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import Typedirection from '..//../assets/typedirection.json';
declare var require: any
declare let L: any;

@Component({
    selector: 'app-leaflet',
    templateUrl: './leaflet.component.html',
    styleUrls: ['./leaflet.component.css']
})
export class LeafletComponent implements OnInit {
    // var app = this

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
    rectangleMap: any;
    polygonMap: any;
    polylineMap: any;
    featureGroup: any;
    dataSearch: any[] = []
    dataRouting: any;
    drawPolyline: any;
    polylineDecode: any;
    printMarkerLocation: any
    startPoint: any;
    endPoint: any;
    arrMarker: any[] = []
    id: number = 0;
    markers: any = {};
    idMarker: any;
    listMarker: any;
    resultWay: string = '';
    routes:any[] = [];
    distanceWay:number = 0;
    timeWay:number = 0;
    hours :number = 0;
    minutes:number = 0
    icon:string='';

    @HostListener("contextmenu", ["$event"])
    public onClick(event: any): void {
        console.log(event, 'event');
    }
    @HostListener("click", ["$event"])
    public onClick2(e: any): void {
        if(this.markerSelected){
            this.map.removeLayer(this.markerSelected);
        }
        var app = this;
        if (e.target.id == '2') {
            this.map.removeLayer(this.featureGroup)
            let latlng = [this.markerSelected._latlng.lat, this.markerSelected._latlng.lng]
            this.markers[this.id += 1] = L.marker(latlng, {
                myCustomId: this.idMarker,
                icon: L.icon({
                    iconSize: [30, 40],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -15],
                    iconUrl: 'https://maps.vietmap.vn/live/assets/icon/marker-start.png',
                    shadowUrl: 'leaflet/marker-shadow.png',
                }),
                draggable: true,
            }).on('click', function (e: any) {
                // console.log(e, 'e');

            }).on('dragend', function (e: any) {
                app.routerMap()
                app.polylineMap.removeFrom(app.map)
            }).addTo(this.map)
            this.routerMap()
            this.polylineMap.removeFrom(this.map)
        } else if (e.target.id == '5') {
            this.map.removeLayer(this.featureGroup)
            let latlng = [this.markerSelected._latlng.lat, this.markerSelected._latlng.lng]
            this.markers[this.id += 1] = L.marker(latlng, {
                myCustomId: this.idMarker,
                icon: L.icon({
                    iconSize: [30, 40],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -15],
                    iconUrl: 'https://maps.vietmap.vn/live/assets/icon/marker-end.png',
                    shadowUrl: 'leaflet/marker-shadow.png',
                }),
                draggable: true,
            }).on('click', function (e: any) {
                // console.log(e, 'e');

            }).on('dragend', function (e: any) {
                app.routerMap()
                app.polylineMap.removeFrom(app.map)
            }).addTo(this.map)

            this.routerMap()
            this.polylineMap.removeFrom(this.map)
        }
        this.map.closePopup();
    }

    ngOnInit() {
        this.initMap();
    }


    constructor(private apiService: ApiService,private cdr: ChangeDetectorRef) { }
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

        var myRenderer = L.canvas({ tolerance: 10 });

        this.map = L.map('map', {
            zoomControl: false,
            renderer: L.canvas()

        }).setView([10.7121409871872, 106.57287597656251], 12)
        this.VietMap.addTo(this.map)

        this.featureGroup = L.featureGroup().addTo(this.map);

        //hàm này để tạo circle
        this.circleMap = L.circle([10.724284977024212, 106.5557098388672], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500,
            renderer: myRenderer
        }).on("click", function (e: any) {
            e.target.setStyle({ fillColor: 'green', color: 'green' })
        })

        //hàm này để tạo hình chữ nhật
        this.rectangleMap = L.rectangle([[10.7629693011603, 106.53047821848837], [10.744998909981234, 106.557251591558]], {
            color: "#ff7800",
            weight: 1,
            renderer: myRenderer
        }).on("click", function (e: any) {
            e.target.setStyle({ fillColor: 'green', color: 'green' })
        })


        //hàm này để tạo polygon
        this.polygonMap = L.polygon([
            [10.7121409871872, 106.57287597656251],
            [10.692490305822185, 106.55296325683595],
            [10.696285601021225, 106.57442092895509]
        ], {
            renderer: myRenderer
        }).on("click", function (e: any) {
            e.target.setStyle({ fillColor: 'green', color: 'green' })
        })

        //hàm này để tạo polyline
        this.polylineMap = L.polyline([[10.758184367073325, 106.508846282959],
        [10.747981219652846, 106.51451110839845],
        [10.726561920866134, 106.48635864257814],
        [10.713237339606419, 106.50558471679689],
        [10.703201350159523, 106.5256690979004],
        [10.704382072052141, 106.55030250549316],
        ]).on("click", function (e: any) {
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

        let a = this
        let markerA = L.Icon.extend({
            options: {
                iconSize: [30, 40],
                iconAnchor: [15, 30],
                popupAnchor: [0, -15],
                iconUrl: 'https://maps.vietmap.vn/live/assets/icon/marker-start.png',
                shadowUrl: 'leaflet/marker-shadow.png',
            }
        })
        let markerB = L.Icon.extend({
            options: {
                iconSize: [30, 40],
                iconAnchor: [15, 30],
                popupAnchor: [0, -15],
                iconUrl: 'https://maps.vietmap.vn/live/assets/icon/marker-end.png',
                shadowUrl: 'leaflet/marker-shadow.png',
            }
        })

        this.map.on('contextmenu', (e: any) => {
            a.idMarker = a.id += 1;
            
            a.markerSelected = L.marker([e.latlng.lat, e.latlng.lng], {
                myCustomId: a.idMarker,
                icon: L.icon({
                    iconSize: [30, 40],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -15],
                    iconUrl: 'https://maps.vietmap.vn/live/assets/icon/map-marker.png',
                    shadowUrl: 'leaflet/marker-shadow.png',
                }),
                draggable: true,
            }).addTo(this.featureGroup).on('click', function (e: any) {
                // console.log(e, 'e');

            }).on('dragend', function (e: any) {
                // a.routerMap()
                // a.polylineMap.removeFrom(a.map)
            }).addTo(a.map)
            if (a.startPoint == null && a.endPoint == null) {
                a.startPoint = [e.latlng.lat, e.latlng.lng]
                var pop = L.popup({
                    autoClose: true,
                    closeOnClick: true,
                }).setContent(
                    `<p style="font-weight:bold">Thao tác trên địa điểm</p>
                    <p id = "1" style="cursor: pointer">Đây là đâu?</p>
                    <p id = "2" style="cursor: pointer">Dẫn đường từ đây</p>
                    <p id = "3" style="cursor: pointer">Dẫn đường tới đây</p>
                    <p id = "4" style="cursor: pointer">Tìm kiếm xung quanh</p>
                    `);
                    a.markerSelected.bindPopup(pop);
                    a.markerSelected.openPopup();

            } else if (a.startPoint != null && a.endPoint == null) {
                a.endPoint = [e.latlng.lat, e.latlng.lng]
                var pop = L.popup()
                    .setContent(
                        `<p style="font-weight:bold">Thao tác trên địa điểm</p>
                    <p id = "1" style="cursor: pointer">Đây là đâu?</p>
                    <p id = "5" style="cursor: pointer">Thêm điểm đến</p>
                    <p id = "4" style="cursor: pointer">Tìm kiếm xung quanh</p>
                    `)
                    a.markerSelected.bindPopup(pop);
                    a.markerSelected.openPopup();
            } else {
                a.startPoint = a.endPoint
                a.endPoint = [e.latlng.lat, e.latlng.lng]
                var pop = L.popup()
                    .setContent(
                        `<p style="font-weight:bold">Thao tác trên địa điểm</p>
                    <p id = "1" style="cursor: pointer">Đây là đâu?</p>
                    <p id = "5" style="cursor: pointer">Thêm điểm đến</p>
                    <p id = "4" style="cursor: pointer">Tìm kiếm xung quanh</p>
                    `)
                    a.markerSelected.bindPopup(pop);
                    a.markerSelected.openPopup();
            }

        })

        //Hàm này để tạo market khi chúng ta click vào bất kì điểm này trên map
        this.map.on('click', function (e: any) {

            // hàm này là routing map (hiểm thị đường đi giữa 2 điểm được chấm trên bản đồ)
            if (a.startPoint == null && a.endPoint == null) {
                a.startPoint = [e.latlng.lat, e.latlng.lng]

            } else if (a.startPoint != null && a.endPoint == null) {
                a.endPoint = [e.latlng.lat, e.latlng.lng]

            } else {
                a.startPoint = a.endPoint
                a.endPoint = [e.latlng.lat, e.latlng.lng]
            }
            a.markers[a.id += 1] = L.marker([e.latlng.lat, e.latlng.lng], {
                myCustomId: a.id += 1,
                icon: L.icon({
                    iconSize: [30, 40],
                    iconAnchor: [15, 30],
                    iconUrl: 'https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png',
                    shadowUrl: 'leaflet/marker-shadow.png',
                }),
                draggable: true,
            }).on('click', function (e: any) {
                // console.log(e, 'e');
            }).on('dragend', function (e: any) {
                a.routerMap()
                a.polylineMap.removeFrom(a.map)
            }).addTo(a.map)
            a.routerMap();
            a.polylineMap.removeFrom(a.map)
        })

        // for (let i = 0; i < 50; i++) {
        //     var icon: any
        //     // hàm này để tạo popup khi chúng ta click vào marker
        //     // const popupClick = L.popup().setContent(
        //     //   `
        //     //   <div style="text-align: center">
        //     //     <p>Tọa Độ: (${icon[i].NewClass._latlng.lat}, ${icon[i].NewClass._latlng.lng})</p>
        //     //   </div>
        //     //   `
        //     //   )
        //     //   icon.bindPopup(popupClick)
        //     // var app = this;
        //     icon = L.marker([10.794019130536723 + 0.5 * (Math.random() - 0.5), 106.71415328979494 + 0.5 * (Math.random() - 0.5)], {
        //         draggable: true,
        //         icon: L.icon({
        //             iconSize: [30, 40],
        //             iconAnchor: [15, 0],
        //             iconUrl: 'https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png',
        //             shadowUrl: 'leaflet/marker-shadow.png',
        //         })
        //     }).addTo(this.featureGroup).on("click", function (e:any) {
        //         for (let i = 0; i < 50; i++) {
        //             if (a.markerSelected) {
        //                 a.markerSelected.setIcon(
        //                     L.icon({
        //                         iconUrl: "https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png"
        //                     })
        //                 )
        //             }
        //             if (a.markerSelected = e.target) {
        //                 a.markerSelected.setIcon(
        //                     L.icon({
        //                         iconUrl: "leaflet/marker-icon.png"
        //                     })
        //                 )
        //             }
        //         }
        //     })
        // }


        // //hàm này để set view toàn bộ marker khi load lần đầu tiên vào trang web
        // let bounds = this.featureGroup.getBounds();
        // this.map.fitBounds(bounds);

        const BaseMap = {
            "VietMap": this.VietMap,
            "Satellite": this.satellite,
            "Hybird": this.hybird,
        };

        const cities = {
            "Circle": this.circleMap,
            "Rectangle": this.rectangleMap,
            "Polygon": this.polygonMap,
            "Poliline": this.polylineMap,
            "icon": this.featureGroup
        }
        L.control.layers(BaseMap, cities).addTo(this.map);



        // function routerMap2(param: string) {
        //     a.apiService.routerMap2(param).pipe(
        //         catchError((err, caught) => {
        //             return (err);
        //         })
        //     ).subscribe((res: any) => {
        //         if (res.code == "OK") {
        //             let polyUtil = require('polyline-encoded');
        //             let latlngs = [];
        //             if (res.paths[0].points != undefined) {
        //                 latlngs = polyUtil.decode(res.paths[0].points);
        //             }
        //             a.polylineMap = L.polyline([latlngs]).addTo(a.map);

        //         }
        //     });
        // }
    }


    routerMap() {
        this.map.closePopup();
        //hàm này để tạo ra list điểm cần routing
        this.listMarker = [];
        let keys = Object.keys(this.markers);
        for (let key of keys) {
            this.listMarker.push(this.markers[key].getLatLng());
        }
      
        let param = ''
        let paramStart = ''
        let paramEnd = ''


        //hàm này dùng để nối điểm routing lại và kéo thả trên map
        for (let i = 0; i < this.listMarker.length; i++) {
            if (i == 0) {
                paramStart = 'point=' + [this.listMarker[0].lat, this.listMarker[0].lng].toString()

            } else {
                paramEnd += '&point=' + [this.listMarker[i].lat, this.listMarker[i].lng].toString()
            }
            //paramEnd += '&point=' + [listMarker[i].lat, listMarker[i].lng].toString()
        }
        param = paramStart + paramEnd


        let mapping:Map<Number,{value:number,icon:string,des:string} >=new Map<Number,{value:number,icon:string,des:string} >();
        //init value
        // mapping.set(-98,"assets/img/right.png");
        // mapping.set(1,"assets/img/right.png");
        // mapping.set(2,"assets/img/right.png");
        // mapping.set(3,"assets/img/right.png");
        // mapping.set(-98,"assets/img/right.png");
        Typedirection.forEach(element => {
            mapping.set(element.value,{value:element.value,icon:element.icon,des:element.des})
        });

        let routes:Array<{resultWay:string,distanceWay:number,timeWay:number,sign:string}>=new Array<{resultWay:string,distanceWay:number,timeWay:number,sign:string}>();
        //call api
        this.apiService.routerMap2(param).pipe(
            catchError((err, caught) => {
                return (err);
            })
        ).subscribe((res: any) => {
            if (res.code == "OK") {
                let driverWay = res.paths[0].instructions
                for(let i = 0; i < driverWay.length; i++) {
                    // this.resultWay +=  driverWay[i].text + ` <br> `
                    this.distanceWay += driverWay[i].distance/1000
                    this.timeWay += driverWay[i].time;
                    let icon= ''
                    Typedirection.map(e=>{
                        if(e.value == driverWay[i].sign){
                            icon = e.icon;
                        }
                    })
                   /*  if(mapping.has(driverWay[i].sign)){
                        this.resultWay +=  driverWay[i].text
                        this.icon = mapping.get(driverWay[i].sign)?.icon??"";

                        
                    }else{
                        this.icon="";
                    } */
                    var route={resultWay:driverWay[i].text,distanceWay:driverWay[i].distance/1000,timeWay:driverWay[i].time,sign:icon};
                    this.routes.push(route);                    
                }

                console.log(this.routes,'routes');
                this.cdr.detectChanges()

                let polyUtil = require('polyline-encoded');
                let latlngs = [];
                if (res.paths != '') {
                    if (res.paths[0].points != undefined) {
                        latlngs = polyUtil.decode(res.paths[0].points);
                    }
                }
                this.polylineMap = L.polyline([latlngs]).addTo(this.map);
            }
        });
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
                this.map.panTo([res.latitude, res.longitude])
                L.marker([res.latitude,res.longitude], {
                    icon: L.icon({
                        iconSize: [30, 40],
                        iconAnchor: [15, 30],
                        iconUrl: 'https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png',
                        shadowUrl: 'leaflet/marker-shadow.png',
                    }),
                    draggable: true,
                }).addTo(this.map)
            }
        });

    }

    selectAddStart(event: any) {
        let refPlaceId = event.refPlaceId;
        this.apiService.place(refPlaceId).pipe(
            catchError(err => (err))
        ).subscribe((res: any) => {
            if (res !== null) {
                this.map.removeLayer(this.featureGroup)
                this.polylineMap.removeFrom(this.map)
                console.log(res);
                localStorage.setItem('dataMarker', JSON.stringify(res));
                this.map.panTo([res.latitude, res.longitude])
                this.markers[this.id += 1] = L.marker([res.latitude, res.longitude], {
                    myCustomId: this.id += 1,
                    icon: L.icon({
                        iconSize: [30, 40],
                        iconAnchor: [15, 30],
                        iconUrl: 'https://maps.vietmap.vn/live/assets/icon/marker-start.png',
                        shadowUrl: 'leaflet/marker-shadow.png',
                    }),
                    draggable: true,
                }).addTo(this.featureGroup).on('click', function (e: any) {
                    // console.log(e, 'e');
                }).on('dragend', (e: any)=> {
                    this.polylineMap.removeFrom(this.map)
                    this.routerMap()
                }).addTo(this.map)
                this.polylineMap.removeFrom(this.map)
                this.routerMap();
            }
        });

    }

    selectAddEnd(event: any) {
        let refPlaceId = event.refPlaceId;
        this.apiService.place(refPlaceId).pipe(
            catchError(err => (err))
        ).subscribe((res: any) => {
            if (res !== null) {
                this.map.removeLayer(this.featureGroup)
                this.polylineMap.removeFrom(this.map)
                console.log(res);
                localStorage.setItem('dataMarker', JSON.stringify(res));
                this.map.panTo([res.latitude, res.longitude])
                this.markers[this.id += 1] = L.marker([res.latitude, res.longitude], {
                    myCustomId: this.id += 1,
                    icon: L.icon({
                        iconSize: [30, 40],
                        iconAnchor: [15, 30],
                        iconUrl: 'https://maps.vietmap.vn/live/assets/icon/marker-end.png',
                        shadowUrl: 'leaflet/marker-shadow.png',
                    }),
                    draggable: true,
                }).addTo(this.featureGroup).on('click', function (e: any) {
                    // console.log(e, 'e');
                }).on('dragend', (e: any)=> {
                    this.polylineMap.removeFrom(this.map)
                    this.routerMap()
                }).addTo(this.map)
                this.polylineMap.removeFrom(this.map)
                this.routerMap();
            }
        });

    }
}


