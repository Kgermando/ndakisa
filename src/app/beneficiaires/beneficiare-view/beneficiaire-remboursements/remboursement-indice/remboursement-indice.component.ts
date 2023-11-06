import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PlanRemboursementModel } from 'src/app/beneficiaires/models/plan_remousement.model';
import { RemboursementModel } from 'src/app/beneficiaires/models/remboursement.model';
import { PlanRemboursementService } from 'src/app/beneficiaires/plan_remboursement.service';
import { RemboursementService } from 'src/app/beneficiaires/remboursement.service';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-remboursement-indice',
  templateUrl: './remboursement-indice.component.html',
  styleUrls: ['./remboursement-indice.component.scss']
})
export class RemboursementIndiceComponent implements OnInit {
  @Input() id: number;
  @Input() plan_remboursement: PlanRemboursementModel;

  planRemboursementList: PlanRemboursementModel[] = [];
  remboursementList: RemboursementModel[] = [];

  planRemboursementIndiceList: PlanRemboursementModel[] = [];
  remboursementIndiceList: RemboursementModel[] = [];
  indice = 0;
  indicePlanRemboursement = 0;
  indiceRemboursement = 0;

  constructor(
    public themeService: CustomizerSettingsService,
    private planRemboursementService: PlanRemboursementService,
    private remboursementService: RemboursementService, ) {}


  ngOnInit(): void {
    this.planRemboursementService.getAllData(this.id).subscribe(res => {
    this.planRemboursementList = res; 
      this.remboursementService.getAllData(this.id).subscribe(remboursement => {
        this.remboursementList = remboursement; 
        
        this.planRemboursementIndiceList = this.planRemboursementList.filter(
          (v) => formatDate(v.date_de_rembousement,'yyyy-MM','en_US') <= formatDate(this.plan_remboursement.date_de_rembousement,'yyyy-MM','en_US')
        );

        this.remboursementIndiceList = this.remboursementList.filter(
          (v) => {
            formatDate(v.date_paiement,'yyyy-MM','en_US') <= formatDate(this.plan_remboursement.date_de_rembousement,'yyyy-MM','en_US');
            if (formatDate(v.date_paiement,'yyyy-MM','en_US') <= formatDate(this.plan_remboursement.date_de_rembousement,'yyyy-MM','en_US')) {
              this.indiceRemboursement = this.remboursementIndiceList.reduce(function(sum, value){
                return sum + parseFloat(value.montant_payer); 
                }, 0);
            } else {
              this.indiceRemboursement = 0;
            }
          }
        );

        this.indicePlanRemboursement = this.planRemboursementIndiceList.reduce(function(sum, value){
          return sum + parseFloat(value.mensualite);
        }, 0);

         

          this.indice = this.indiceRemboursement - this.indicePlanRemboursement;

          console.log('remboursementList', this.remboursementList);
      });
    });
  }

}
