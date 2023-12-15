import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PlanRemboursementModel } from 'src/app/beneficiaires/models/plan_remousement.model'; 
import { PlanRemboursementService } from 'src/app/beneficiaires/plan_remboursement.service'; 
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-remboursement-indice',
  templateUrl: './remboursement-indice.component.html',
  styleUrls: ['./remboursement-indice.component.scss']
})
export class RemboursementIndiceComponent implements OnChanges {
  @Input() id: number;
  @Input() plan_remboursement: PlanRemboursementModel;

  planRemboursementList: PlanRemboursementModel[] = [];

  planRemboursementIndiceList: PlanRemboursementModel[] = [];
  indice = 0;
  indicePlanRemboursement = 0;
  indiceRemboursement = 0;

  constructor(
    public themeService: CustomizerSettingsService,
    private planRemboursementService: PlanRemboursementService
  ) {}

 

  ngOnChanges(changes: SimpleChanges): void {
      this.planRemboursementService.getAllData(this.id).subscribe(res => {
      this.planRemboursementList = res;
      this.planRemboursementIndiceList = this.planRemboursementList.filter(
        (v) => formatDate(v.date_de_rembousement,'yyyy-MM','en_US') <= formatDate(this.plan_remboursement.date_de_rembousement,'yyyy-MM','en_US')
      );
      this.indiceRemboursement = this.planRemboursementIndiceList.reduce(function(sum, value) {
        return sum + parseFloat(value.montant_payer); 
        }, 0);
      this.indicePlanRemboursement = this.planRemboursementIndiceList.reduce(function(sum, value) {
        return sum + parseFloat(value.interet) + parseFloat(value.capital);
      },0);

      var index = this.indiceRemboursement - this.indicePlanRemboursement;
      this.indice = parseFloat(index.toFixed(2));

      // console.log('remboursementList', this.remboursementList);
    });
  }

}
