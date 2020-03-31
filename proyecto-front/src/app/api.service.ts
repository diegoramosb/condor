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
    this.httpClient.get(`${this.apiUrl}/bubble`).subscribe(ans => { return ans })
  }

  public getHistoricData(word: string) {
    var params = new HttpParams().set("word", word);
    return this.httpClient.get(`${this.apiUrl}/historic`, {params: params});
  }
}
