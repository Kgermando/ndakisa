import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogUserService extends ApiService {
  endpoint: string = `${environment.apiURL}/logs`;

  // allFilter(start_date: string, end_date: string, page?: number): Observable<any> {
  //   let url = `${this.endpoint}/${start_date}/${end_date}`;
  //   if (page) { // page is optional
  //     url += `?page=${page}`;
  //   } 
  //   return this.http.get(url); 
  // }

  allGetLog(start_date: string, end_date: string): Observable<any> {
    return this.http.get(`${this.endpoint}/get-log/${start_date}/${end_date}`);
  }
 

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

  downloadReport(start_date: string, end_date: string): Observable<any> {
    return this.http.post(`${this.endpoint}/download-xlsx/${start_date}/${end_date}`, {}, {responseType: 'blob'});
  }
}
