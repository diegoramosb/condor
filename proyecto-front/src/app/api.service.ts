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

  public getGraphData(words: string[]) {
    var params = "?";
    for(var i = 0; i < words.length; i++) {
      if(i < words.length - 1) {
        params += "words=" + words[i] + "&";
      }
      else {
        params += "words=" + words[i];
      }
    }
    
    return this.httpClient.get(`${this.apiUrl}/grafo` + params);
  }
}
