import { Component, Input, OnInit } from '@angular/core';
import { CohorteModel } from '../models/cohorte.model';
import { CohorteService } from '../cohorte.service';

@Component({
  selector: 'app-cohorte-garantie',
  templateUrl: './cohorte-garantie.component.html',
  styleUrls: ['./cohorte-garantie.component.scss']
})
export class CohorteGarantieComponent implements OnInit {
  @Input('item') item: CohorteModel;

  credit_accorde = 0;

  constructor(private cohorteService: CohorteService) {}

  ngOnInit(): void {
    this.cohorteService.getTotalGarantie(this.item.id).subscribe(res => {
      this.credit_accorde = res[0].credit_accorde; 
    });

    // if(this.item.beneficiaires) {
    //   this.montant_garantie = this.item.beneficiaires.reduce(function(sum, value){
    //     return sum + parseFloat(value.montant_garantie); 
    //   }, 0);
    // }
  }
}
