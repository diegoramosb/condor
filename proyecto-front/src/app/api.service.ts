import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BubbleData } from './models/bubble-data'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl: string = 'http://localhost:9090'

  constructor(private httpClient: HttpClient) {}

  public getBubbleData(url?: string) {
    return this.httpClient.get(`${this.apiUrl}/`).subscribe(ans => {console.log(ans)})
  }
}
