import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private Http: HttpClient) { }

  searchApi(text: any) {
    return this.Http.get(environment.domain + `api/autocomplete?focus.point.lat=0&focus.point.lon=0&api-version=1.2&apikey=${environment.apiKey}&text=${text}`);
  }
  place(placeId: any) {
    return this.Http.get(environment.domain + `api/place?placeId=${placeId}&apikey=${environment.apiKey}&api-version=1.2`);
  }
  routerMap(a: any, b: any) {
    return this.Http.get(environment.domain2 + `api/route?point=${a}&point=${b}&instructions=true&type=json&locale=vi&apikey=${environment.apiKey3}&vehicle=motorcycle&points_encoded=true&api-version=1.1`)
  }

  routerMap2(param: string) {
    return this.Http.get(environment.domain2 + `api/route?${param}&instructions=true&type=json&locale=vi&apikey=${environment.apiKey3}&vehicle=car&points_encoded=true&api-version=1.1`)
  }
}