import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-nombre',
  templateUrl: './stats-nombre.component.html',
  styleUrls: ['./stats-nombre.component.scss']
})
export class StatsNombreComponent {

  totalGarantie = 70000;
  totalCreditAccorde = 62500;
  totalARembourser = 64500;
  totalRembourse = 21500;
}
