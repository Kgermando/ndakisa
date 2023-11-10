import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ApiService {
  endpoint: string = `${environment.apiURL}/dashboard`;


  totalBeneficiaire(): Observable<any> {
    return this.http.get(`${this.endpoint}/beneficiaires`);
  }

  totalCohorte(): Observable<any> {
    return this.http.get(`${this.endpoint}/cohortes`);
  }

  totalBanque(): Observable<any> {
    return this.http.get(`${this.endpoint}/banques`);
  }

  sexe(): Observable<any> {
    return this.http.get(`${this.endpoint}/sexe`);
  }


  ageBeneficiaires(): Observable<any> {
    return this.http.get(`${this.endpoint}/age`);
  }

  totalGarantie(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-garantie/${start_date}/${end_date}`);
  }

  totalCreditAccorde(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/credit-accorde/${start_date}/${end_date}`);
  }

  totalARembourser(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-a-rembourser/${start_date}/${end_date}`);
  }

  totalRembourse(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-rembourser/${start_date}/${end_date}`);
  }

  resteARembourse(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/reste-a-rembourser/${start_date}/${end_date}`);
  }

  participationParBanque(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/participation-par-banque/${start_date}/${end_date}`);
  }

  statutBeneficiaires(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/statut-beneficiaire/${start_date}/${end_date}`);
  }

  tauxParticipatiionProvince(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/taux-participation-province/${start_date}/${end_date}`);
  }

  remboursementTotalEtReste(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-remboursement-reste/${start_date}/${end_date}`);
  } 

  remboursementCohorte(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/remboursement-cohorte/${start_date}/${end_date}`);
  }

}
