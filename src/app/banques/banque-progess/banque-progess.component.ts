import { Component, Input, OnInit } from '@angular/core'; 
import { BanqueModel } from '../models/banque.model';

@Component({
  selector: 'app-banque-progess',
  templateUrl: './banque-progess.component.html',
  styleUrls: ['./banque-progess.component.scss']
})
export class BanqueProgessComponent implements OnInit {
  @Input('item') item: BanqueModel;

  montant_a_debourser = 0;
  total = 0;
  pourcent = 0;

  ngOnInit(): void {
    if (this.item.plan_remboursements) {
      for(let beneficiaire of this.item.beneficiaires) {
        this.montant_a_debourser =+ parseFloat(beneficiaire.montant_a_debourser); 
      }
      for(let remboursement of this.item.plan_remboursements) {
        this.total =+ parseFloat(remboursement.montant_payer); 
      }
      var pourcents = this.total * 100 / this.montant_a_debourser;
      this.pourcent = parseFloat(pourcents.toFixed(2));
    }
   
  }
}
