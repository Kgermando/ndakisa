import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorbelService extends ApiService {
  endpoint: string = `${environment.apiURL}/corbeil`;

  getAllCohorte(): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-cohorte`);
  }

  getAllBeneficiaire(): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-beneficiaire`);
  }

  getAllUser(): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all-user`);
  }
}
