import { Component, Input, OnInit } from '@angular/core';
import { CohorteModel } from '../../models/cohorte.model';

@Component({
  selector: 'app-cohorte-progress',
  templateUrl: './cohorte-progress.component.html',
  styleUrls: ['./cohorte-progress.component.scss']
})
export class CohorteProgressComponent implements OnInit {

  @Input('item') item: CohorteModel;

  total = 0;
  pourcent = 0;

  ngOnInit(): void {
    if (this.item.remboursements) {
      for(let beneficiaire of this.item.remboursements) {
        this.total =+ parseFloat(beneficiaire.montant_payer);
  
        this.pourcent = this.total * 100 / parseFloat(this.item.montant_global);
      }
    }
   
  }

}
