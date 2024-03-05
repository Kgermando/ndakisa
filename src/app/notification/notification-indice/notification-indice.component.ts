import { Component, Input, SimpleChanges } from '@angular/core';
import { BeneficiareService } from 'src/app/beneficiaires/beneficiare.service';

@Component({
  selector: 'app-notification-indice',
  templateUrl: './notification-indice.component.html',
  styleUrls: ['./notification-indice.component.scss']
})
export class NotificationIndiceComponent {
  @Input('id') id: number;

  reste_a_payer = 0;

  constructor( 
    private beneficiareService: BeneficiareService, ) {}


  ngOnChanges(changes: SimpleChanges): void {
    this.beneficiareService.resteAPayer(this.id).subscribe(reste => {
      this.reste_a_payer = reste[0].reste_a_payer;
    });
  }
 
}
