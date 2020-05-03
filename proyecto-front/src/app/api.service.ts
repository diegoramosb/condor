import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl: string = 'http://localhost:9090'

  constructor(private httpClient: HttpClient) { }

  public getBubbleChartData(words: string[], accounts: string[], date: moment.Moment) {
    var params = new HttpParams();
    words.forEach(word => {
      params = params.append("word", word);
    });
    accounts.forEach(account => {
      params = params.append("account", account);
    });
    if(date != null) {
      params = params.append("date", date.format('DD-MM-YYYY'))
    }
    return this.httpClient.get(`${this.apiUrl}/bubble`, {params: params});
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

  public getAccounts() {
    return this.httpClient.get(`${this.apiUrl}/getAccounts`);
  }

  public unsubscribeFromAccount(accountId) {
    return this.httpClient.delete(`${this.apiUrl}/unsubscribe?id=`+accountId)
  }

  public getTweets() {
    return this.httpClient.get(`${this.apiUrl}/tweets`);
  }

  public getTweetsWord(word: string) {
    return this.httpClient.get(`${this.apiUrl}/tweetsbyword?word=`+word);
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
