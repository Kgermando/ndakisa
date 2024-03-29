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


  tranchAgeBeneficiaires(): Observable<any> {
    return this.http.get(`${this.endpoint}/tranche-age`);
  }

  totalGarantie(): Observable<any> {
    return this.http.get(`${this.endpoint}/total-garantie`);
  }

  totalCreditAccorde(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/credit-accorde/${start_date}/${end_date}`);
  }

  participationParBanque(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/participation-par-banque/${start_date}/${end_date}`);
  }

  statutBeneficiaires(): Observable<any> {
    return this.http.get(`${this.endpoint}/statut-beneficiaire`);
  }

  tauxParticipatiionProvince(): Observable<any> {
    return this.http.get(`${this.endpoint}/taux-participation-province`);
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

  statutCohorte(): Observable<any> {
    return this.http.get(`${this.endpoint}/statut-cohorte`);
  }
  
  secteurActivite(): Observable<any> {
    return this.http.get(`${this.endpoint}/secteurs-activites`);
  }


  remboursementTotalEtReste(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/total-remboursement-reste/${start_date}/${end_date}`);
  } 

  beneficiaireParCohorte(): Observable<any> {
    return this.http.get(`${this.endpoint}/beneficiaire-cohorte`);
  }
  
  progressionRemboursementParSexe(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/progression-remboursements-sexe/${start_date}/${end_date}`);
  }

  remboursementsInterrompus(): Observable<any> {
    return this.http.get(`${this.endpoint}/remboursements-interrompus`);
  }

  remboursementsInterrompuPourcent(): Observable<any> {
    return this.http.get(`${this.endpoint}/remboursements-interrompu-pourcent`);
  }

}
