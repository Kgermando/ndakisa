import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanqueCohorteService extends ApiService {
  endpoint: string = `${environment.apiURL}/banque-cohortes`;

  getAllData(): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-data`);
  } 

  getGuarantieBanque(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-guarantie-banque/${id}`);
  }

  getTotalGuarantieBanque(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-total-guarantie-banque/${id}`);
  }

  getTotalGuarantieCohorte(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-total-guarantie-cohorte/${id}`);
  }
 

}
