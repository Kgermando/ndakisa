import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { PlanRemboursementService } from '../plan_remboursement.service';

@Component({
  selector: 'app-montant-rembourser',
  templateUrl: './montant-rembourser.component.html',
  styleUrls: ['./montant-rembourser.component.scss']
})
export class MontantRembourserComponent implements OnChanges {

  @Input('item') item: BeneficiaireModel;

  total = 0;

  constructor( 
    private planRemboursementService: PlanRemboursementService,  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    this.planRemboursementService.totalRemboursE(this.item.id).subscribe((res) => {
      this.total = res[0].montant_payer;
      }
    ); 
  }
 
}
