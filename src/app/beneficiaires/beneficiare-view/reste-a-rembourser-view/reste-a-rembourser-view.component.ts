import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BeneficiaireModel } from '../../models/beneficiaire.model';

@Component({
  selector: 'app-reste-a-rembourser-view',
  templateUrl: './reste-a-rembourser-view.component.html',
  styleUrls: ['./reste-a-rembourser-view.component.scss']
})
export class ResteARembourserViewComponent implements OnChanges {
 
  @Input('item') item: BeneficiaireModel;

  totalPayE = 0;
  reste = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.item.plan_remboursements) {
      this.totalPayE = this.item.plan_remboursements.reduce(function(sum, value){
        return sum + parseFloat(value.montant_payer); 
       }, 0);
      this.reste = this.totalPayE - parseFloat(this.item.montant_a_debourser); 
    }
  } 
}
