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


  public getFrecuencyChartData(word: string) {
    var params = new HttpParams().set("word", word);
    return this.httpClient.get(`${this.apiUrl}/nube`, {params: params});
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

  public updateTweets() {
    return this.httpClient.get(`${this.apiUrl}/updateTweets`);
  }

  public extractTweets(accounts: string[], number: number) {
    var params = `?number=${number}&`;
    for(var i = 0; i < accounts.length; i++) {
      if(i < accounts.length - 1) {
        params += "account=" + accounts[i] + "&";
      }
      else {
        params += "account=" + accounts[i];
      }
    }
    return this.httpClient.get(`${this.apiUrl}/extractTweets` + params);
  }
}
