import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecteurService extends ApiService {
  endpoint: string = `${environment.apiURL}/secteurs`;

}