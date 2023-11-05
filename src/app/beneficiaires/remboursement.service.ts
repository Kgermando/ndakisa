import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemboursementService extends ApiService {
  endpoint: string = `${environment.apiURL}/remboursements`;

  getAllData(id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/get-all/${id}`);
  }
}
