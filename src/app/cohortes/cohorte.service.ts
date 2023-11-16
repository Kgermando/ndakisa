import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CohorteService extends ApiService {
  endpoint: string = `${environment.apiURL}/cohortes`;

  getAllNav(): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-nav`);
  }

  downloadReport(start_date: string, end_date: string): Observable<any> {
    return this.http.post(`${this.endpoint}/download-xlsx/${start_date}/${end_date}`, {}, {responseType: 'blob'});
  }
}
