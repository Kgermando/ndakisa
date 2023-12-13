import { Component, Input } from '@angular/core';
import { CohorteService } from '../cohorte.service';
import { CohorteModel } from '../models/cohorte.model';

@Component({
  selector: 'app-cohorte-nbre-beneficiaires',
  templateUrl: './cohorte-nbre-beneficiaires.component.html',
  styleUrls: ['./cohorte-nbre-beneficiaires.component.scss']
})
export class CohorteNbreBeneficiairesComponent {
  @Input('item') item: CohorteModel;

  nbreBeneficiaire = 0;

  constructor(private cohorteService: CohorteService) {}

  ngOnInit(): void {
    this.cohorteService.nbreBeneficiaireCohorte(this.item.id).subscribe(res => {
      this.nbreBeneficiaire = res[0].count;
    });
  }
}
