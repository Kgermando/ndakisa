import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-insolvables',
  templateUrl: './stats-insolvables.component.html',
  styleUrls: ['./stats-insolvables.component.scss']
})
export class StatsInsolvablesComponent {
  @Input() remboursementInterrompus: number;
  @Input() remboursementInterrompuPourcent: number;

}
