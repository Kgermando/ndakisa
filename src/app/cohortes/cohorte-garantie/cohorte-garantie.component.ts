import { Component, Input, OnInit } from '@angular/core';
import { CohorteModel } from '../models/cohorte.model';

@Component({
  selector: 'app-cohorte-garantie',
  templateUrl: './cohorte-garantie.component.html',
  styleUrls: ['./cohorte-garantie.component.scss']
})
export class CohorteGarantieComponent implements OnInit {
  @Input('item') item: CohorteModel;

  montant_garantie = 0;

  ngOnInit(): void {
    if(this.item.beneficiaires) {
      this.montant_garantie = this.item.beneficiaires.reduce(function(sum, value){
        return sum + parseFloat(value.montant_garantie); 
      }, 0);
    }
  }
}
 