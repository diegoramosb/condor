import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GraphDataService {
    constructor(private httpClient: HttpClient) { }
     
    getBubbleData() {
        return this.httpClient.get('google.com');
    } 
}
