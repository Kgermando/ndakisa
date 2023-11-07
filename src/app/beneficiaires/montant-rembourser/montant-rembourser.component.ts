import { Component, Input } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model';

@Component({
  selector: 'app-montant-rembourser',
  templateUrl: './montant-rembourser.component.html',
  styleUrls: ['./montant-rembourser.component.scss']
})
export class MontantRembourserComponent {
  @Input('item') item: BeneficiaireModel;

  total = 0; 

  ngOnInit(): void {
    if (this.item.plan_remboursements) {
      this.total = this.item.plan_remboursements.reduce(function(sum, value){
        return sum + parseFloat(value.montant_payer); 
       }, 0);
      
    }
   
  }

}
