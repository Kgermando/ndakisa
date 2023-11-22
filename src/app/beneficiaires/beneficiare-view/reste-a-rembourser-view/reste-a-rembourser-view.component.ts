import { Component, Input } from '@angular/core';
import { BeneficiaireModel } from '../../models/beneficiaire.model';

@Component({
  selector: 'app-reste-a-rembourser-view',
  templateUrl: './reste-a-rembourser-view.component.html',
  styleUrls: ['./reste-a-rembourser-view.component.scss']
})
export class ResteARembourserViewComponent {
  @Input('item') item: BeneficiaireModel;

  totalPayE = 0;
  reste = 0;

  ngOnInit(): void {
    if (this.item.plan_remboursements) {
      this.totalPayE = this.item.plan_remboursements.reduce(function(sum, value){
        return sum + parseFloat(value.montant_payer); 
       }, 0);

      // for(let beneficiaire of this.item.remboursements) {
      //   this.totalPayE =+ parseFloat(beneficiaire.montant_payer); 
      // }
      this.reste = this.totalPayE - parseFloat(this.item.montant_a_debourser); 
    }
  }
}
