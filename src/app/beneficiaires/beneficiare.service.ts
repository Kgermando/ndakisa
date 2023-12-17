import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeneficiareService extends ApiService {
  endpoint: string = `${environment.apiURL}/beneficiaires`;

  getAllCohorte(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-cohorte/${id}`);
  }

  getAllBanque(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-banque/${id}`);
  }

  getAllSecteur(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-secteur/${id}`);
  } 

  
  tauxProgessionBeneficiaire(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/taux-progression-beneficiaire/${id}`);
  }
 
}
