import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl: string = 'http://10.128.0.5:9090'

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
      params = params.append("date", date.format('YYYY-MM-DD'))
    }
    return this.httpClient.get(`${this.apiUrl}/bubble`, {params: params});
  }

  public getHistoricData(words: string[], accounts: string[], date: moment.Moment) {
    var params = new HttpParams();
    words.forEach(word => {
      params = params.append("word", word);
    });
    accounts.forEach(account => {
      params = params.append("account", account);
    });
    if(date != null) {
      params = params.append("date", date.format('YYYY-MM-DD'))
    }
    return this.httpClient.get(`${this.apiUrl}/historic`, {params: params});
  }


  public getFrecuencyChartData(words: string[], accounts: string[], date: moment.Moment) {
    var params = new HttpParams();
    words.forEach(word => {
      params = params.append("word", word);
    });
    accounts.forEach(account => {
      params = params.append("account", account);
    });
    if(date != null) {
      params = params.append("date", date.format('YYYY-MM-DD'))
    }
    return this.httpClient.get(`${this.apiUrl}/nube`, {params: params});
  }

  public getGraphData(words: string[], accounts: string[], date: moment.Moment) {
    var params = new HttpParams();
    words.forEach(word => {
      params = params.append("word", word);
    });
    accounts.forEach(account => {
      params = params.append("account", account);
    });
    if(date != null) {
      params = params.append("date", date.format('YYYY-MM-DD'))
    }

    return this.httpClient.get(`${this.apiUrl}/grafo`, {params: params});

  }

  public getAccounts() {
    return this.httpClient.get(`${this.apiUrl}/getAccounts`);
  }

  public unsubscribeFromAccount(accountId: number) {
    var params = new HttpParams().append("accountId", accountId.toString())
    return this.httpClient.delete(`${this.apiUrl}/unsubscribe`, {params: params})
  }

  public getTweets() {
    return this.httpClient.get(`${this.apiUrl}/tweets`);
  }

  public getTweetsFilters(words: string[], accounts: string[], date: moment.Moment, polarities: string[]) {
    var params = new HttpParams();
    words.forEach(word => {
      params = params.append("word", word);
    });
    accounts.forEach(account => {
      params = params.append("account", account);
    });
    polarities.forEach(pol => {
      params = params.append("polarity", pol);
    });
    if(date != null) {
      params = params.append("date", date.format('YYYY-MM-DD'))
    }
    return this.httpClient.get(`${this.apiUrl}/getfiltros`, {params: params});
  }

  public setPolarity(tweetId: string, polarity: string) {
    var params = new HttpParams().append("tweetId", tweetId);
    params = params.append("polarity", polarity);
    return this.httpClient.put(`${this.apiUrl}/setPolarity`, {"tweetId": tweetId, "polarity": polarity})
  }

  public updateTweets() {
    return this.httpClient.get(`${this.apiUrl}/updateTweets`);
  }

  public extractTweets(accounts: string[]) {
    var params = new HttpParams();
    accounts.forEach(account => {
      params = params.append("account", account);
    });
    params = params.append("number", Math.floor(200 / accounts.length).toString());
    return this.httpClient.get(`${this.apiUrl}/extractTweets`, {params: params});
  }

  public searchNewUser(screenName) {
    if(!(screenName instanceof Object)) {
      var trimmedName = screenName.startsWith("@") ? screenName.substring(1): screenName;
      if(trimmedName.length > 3) {
          var params = new HttpParams().append("screenName", trimmedName);
          return this.httpClient.get(`${this.apiUrl}/searchUser`, {params: params});
      }
      else {
        return []
      }
    }
    else {
      return []
    }
  }
}
