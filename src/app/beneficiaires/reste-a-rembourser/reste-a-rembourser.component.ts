import { Component, Input } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model';

@Component({
  selector: 'app-reste-a-rembourser',
  templateUrl: './reste-a-rembourser.component.html',
  styleUrls: ['./reste-a-rembourser.component.scss']
})
export class ResteARembourserComponent {
  @Input('item') item: BeneficiaireModel;

  totalPayE = 0; 
  reste = 0; 

  ngOnInit(): void {
    if (this.item.remboursements) {
      this.totalPayE = this.item.remboursements.reduce(function(sum, value){
        return sum + parseFloat(value.montant_payer); 
       }, 0);

      // for(let beneficiaire of this.item.remboursements) {
      //   this.totalPayE =+ parseFloat(beneficiaire.montant_payer); 
      // }
      this.reste = parseFloat(this.item.credit_accorde) - this.totalPayE; 
    }
   
  }
}
