import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogUserService extends ApiService {
  endpoint: string = `${environment.apiURL}/logs`;

  createLog(
    id: number, 
    type_operation: string, 
    module: string, 
    title: string,
    observation: string,
  ): Observable<any> {
    var data = {
      user: id,
      date_operation: new Date(),
      type_operation: type_operation,
      module: module,
      title: title,
      observation: observation, 
    }
    return this.http.post(this.endpoint, data);
  }
}
