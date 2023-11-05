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
    if (this.item.remboursements) {
      for(let beneficiaire of this.item.remboursements) {
        this.total =+ parseFloat(beneficiaire.montant_payer);
      }
    }
   
  }

}
