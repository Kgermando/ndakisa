import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  endpoint: string = `${environment.apiURL}/users`;

  
  uploadCSV(data: any): Observable<any> {
    return this.http.post(`${this.endpoint}/upload-csv`, data);
  }


  downloadReport(start_date: string, end_date: string): Observable<any> {
    return this.http.post(`${this.endpoint}/download-xlsx/${start_date}/${end_date}`, {}, {responseType: 'blob'});
  } 

  downloadModelReport(): Observable<any> {
    return this.http.post(`${this.endpoint}/download-model-xlsx`, {}, {responseType: 'blob'});
  }

}