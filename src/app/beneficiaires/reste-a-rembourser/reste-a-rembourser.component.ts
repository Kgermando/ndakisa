import { Component, Input, OnChanges } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { PlanRemboursementService } from '../plan_remboursement.service';

@Component({
  selector: 'app-reste-a-rembourser',
  templateUrl: './reste-a-rembourser.component.html',
  styleUrls: ['./reste-a-rembourser.component.scss']
})
export class ResteARembourserComponent implements OnChanges {
  @Input('item') item: BeneficiaireModel;
  reste = 0;

  constructor( 
    private planRemboursementService: PlanRemboursementService  ) {}


  ngOnChanges(): void {
    this.planRemboursementService.totalResteARembourser(this.item.id).subscribe((res) => {
      this.reste = res[0].reste_a_rembourser; 
      }
    );
  }
}
