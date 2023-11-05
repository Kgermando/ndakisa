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
      for(let beneficiaire of this.item.remboursements) {
        this.totalPayE =+ parseFloat(beneficiaire.montant_payer); 
      }
      this.reste = parseFloat(this.item.montant_a_debourser) - this.totalPayE;
      console.log('montant_a_debourser', this.item.montant_a_debourser);
      console.log('totalPayE', this.totalPayE);
    }
   
  }
}
