import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanRemboursementService extends ApiService {
  endpoint: string = `${environment.apiURL}/plan_remboursements`;


  getAllData(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all/${id}`);
  }

  getAllPlanRemboursementCohorte(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-plan-remboursement-cohorte/${id}`);
  }

  getAllPlanRemboursementBanque(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-plan-remboursement-banque/${id}`);
  }

  totalResteARembourser(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/reste-a-rembourser/${id}`);
  }

  totalRemboursE(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/total-rembourse/${id}`);
  }

  downloadReport(id: number): Observable<any> {
    return this.http.post(`${this.endpoint}/download-xlsx/${id}`, {}, {responseType: 'blob'});
  }


  downloadBordereau(): Observable<any> {
    return this.http.post(`${this.endpoint}/download-pdf`, {}, {responseType: 'blob'});
  }
  
}
