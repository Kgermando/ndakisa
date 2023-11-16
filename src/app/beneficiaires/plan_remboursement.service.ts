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


  downloadBordereau(): Observable<any> {
    return this.http.post(`${this.endpoint}/download-pdf`, {}, {responseType: 'blob'});
  }
}
