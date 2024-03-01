import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ApiService {
  endpoint: string = `${environment.apiURL}/notifications`;

  getCurrentDate(): Observable<any> {
    return this.http.get(`${this.endpoint}/get-current-date`);
  }

  getNotification(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-notifications/${id}`);
  }

  getTotalRemboursements(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-total-remboursements/${id}`);
  }

  getInsolvables(month: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-total-insolvables/${month}`);
  }
 
}
