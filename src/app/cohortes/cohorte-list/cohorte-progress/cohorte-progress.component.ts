import { Component, Input, OnInit } from '@angular/core';
import { CohorteModel } from '../../models/cohorte.model';
import { CohorteService } from '../../cohorte.service';

@Component({
  selector: 'app-cohorte-progress',
  templateUrl: './cohorte-progress.component.html',
  styleUrls: ['./cohorte-progress.component.scss']
})
export class CohorteProgressComponent implements OnInit {
  @Input('item') item: CohorteModel;

  // total = 0;
  // totalARembourser = 0;
  pourcent = 0;

  constructor(private cohorteService: CohorteService) {}
 
  ngOnInit(): void {
    this.cohorteService.tauxProgessionCohorte(this.item.id).subscribe(res => {
      this.pourcent = res[0].pourcentage;
    });
  //   if(this.item.beneficiaires) {
  //     if (this.item.plan_remboursements) {
  //       this.total = this.item.plan_remboursements.reduce(function(sum, value){
  //         return sum + parseFloat(value.montant_payer); 
  //        }, 0);
  //        this.totalARembourser = this.item.beneficiaires.reduce(function(sum, value){
  //         return sum + parseFloat(value.montant_a_debourser); // montant à rembourser
  //        }, 0);
        
  //       var pourcents = (this.total > 0) ? this.total * 100 / this.totalARembourser: 0;
  //       this.pourcent = parseFloat(pourcents.toFixed(2)); 
  //       console.log('total', this.total)
  //     }
  //   }
  }

}
