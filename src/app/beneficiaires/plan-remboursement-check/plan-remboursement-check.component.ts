import { Component, Input } from '@angular/core';
import { PlanRemboursementModel } from '../models/plan_remousement.model';

@Component({
  selector: 'app-plan-remboursement-check',
  templateUrl: './plan-remboursement-check.component.html',
  styleUrls: ['./plan-remboursement-check.component.scss']
})
export class PlanRemboursementCheckComponent {
  @Input() pCheckbox: PlanRemboursementModel;

  

  pCheckboxList: boolean[] = [];



  
}
