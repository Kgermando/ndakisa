import { Component, Input, OnInit } from '@angular/core'; 
import { BanqueModel } from '../models/banque.model';

@Component({
  selector: 'app-banque-progess',
  templateUrl: './banque-progess.component.html',
  styleUrls: ['./banque-progess.component.scss']
})
export class BanqueProgessComponent implements OnInit {
  @Input('item') item: BanqueModel;

  totalCreditAccorde = 0;
  total = 0;
  pourcent = 0;

  ngOnInit(): void {
    if (this.item.remboursements) {
      for(let beneficiaire of this.item.beneficiaires) {
        this.totalCreditAccorde =+ parseFloat(beneficiaire.credit_accorde); 
      }
      for(let remboursement of this.item.remboursements) {
        this.total =+ parseFloat(remboursement.montant_payer); 
      }
      var pourcents = this.total * 100 / this.totalCreditAccorde;
      this.pourcent = parseFloat(pourcents.toFixed(2));
    }
   
  }
}
