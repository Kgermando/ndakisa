import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { PlanRemboursementModel } from '../models/plan_remousement.model';
import { PlanRemboursementService } from '../plan_remboursement.service';

@Component({
  selector: 'app-montant-rembourser',
  templateUrl: './montant-rembourser.component.html',
  styleUrls: ['./montant-rembourser.component.scss']
})
export class MontantRembourserComponent implements OnChanges {

  @Input('item') item: BeneficiaireModel;

  total = 0; 
  ELEMENT_DATA: PlanRemboursementModel[] = [];  

  constructor( 
    private planRemboursementService: PlanRemboursementService,  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    this.planRemboursementService.getAllData(this.item.id).subscribe((res) => {
      this.ELEMENT_DATA = res;
      this.total = this.ELEMENT_DATA.reduce(function(sum, value){
        return sum + parseFloat(value.montant_payer);
      }, 0);
      }
    ); 
  }
 
}
