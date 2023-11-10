import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-chorte-statut',
  templateUrl: './stats-chorte-statut.component.html',
  styleUrls: ['./stats-chorte-statut.component.scss']
})
export class StatsChorteStatutComponent {
  @Input() start_date: string;
  @Input() end_date: string;
}
