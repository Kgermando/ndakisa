import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-beneficiaire-province',
  templateUrl: './stats-beneficiaire-province.component.html',
  styleUrls: ['./stats-beneficiaire-province.component.scss']
})
export class StatsBeneficiaireProvinceComponent {
  @Input() tauxParticipatiionProvinceList:any[] = [];
  // @Input() start_date: string;
  // @Input() end_date: string;

}
