import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormspreeService {
  constructor(private httpClient : HttpClient) { }

  sendMail(mailInfo) {
    let url = "https://formspree.io/f/xbjpenbz";
    return this.httpClient.post<any>(url, mailInfo);
  }
}