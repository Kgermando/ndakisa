import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-stats-nombre',
  templateUrl: './stats-nombre.component.html',
  styleUrls: ['./stats-nombre.component.scss']
})
export class StatsNombreComponent implements OnChanges {
  @Input() totalGarantie: number;
  @Input() totalCreditAccorde: number;
  @Input() totalARembourser: number;
  @Input() totalRembourse: number;
  @Input() resteARembourser: number;
  @Input() isLoading: boolean;
  

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // this.getProgression();
  } 

  // getNombre(): void { 
  //   this.totalGarantie = 0; 
  //   this.totalCreditAccorde = 0; 
  //   this.totalARembourser = 0; 
  //   this.totalRembourse = 0; 
  //   this.resteARembourser = 0;
  // }
    
}
