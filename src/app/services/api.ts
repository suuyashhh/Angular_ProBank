import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {
  baseurl="https://localhost:7265/api/";
  private http = inject(HttpClient);
  private auth = inject(Auth);

  get(api: string, options?: any) {
    return this.http.get(this.baseurl + api, options);
  }

  post(api: string, data: any, options?: any) {
    return this.http.post(this.baseurl + api, data, options);
  }

  // simple helper to send auth header when token present
  authPost(api: string, data: any) {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post(this.baseurl + api, data, { headers });
  }

  put(api: string, data: any) {
    return this.http.put(this.baseurl + api, data)
  }

  delete(api: string) {
    return this.http.delete(this.baseurl + api)
  }
}
