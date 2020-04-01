import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { BubbleData } from './models/bubble-data'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl: string = 'http://localhost:9090'

  constructor(private httpClient: HttpClient) { }

  public getBubbleChartData(word: string) {
    var params = new HttpParams().set("word", word);
    return this.httpClient.get(`${this.apiUrl}/bubble`+ "?word=" + word);
  }

  public getHistoricData(word: string) {
    var params = new HttpParams().set("word", word);
    return this.httpClient.get(`${this.apiUrl}/historic`, {params: params});
  }

  public getFrecuencyChartData(word: string){
    var params = new HttpParams().set("word", word);
    return this.httpClient.get(`${this.apiUrl}/nube`,{params: params});
  }
}
