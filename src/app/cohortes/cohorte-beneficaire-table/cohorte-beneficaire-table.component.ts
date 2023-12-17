import { Component, Input, OnInit } from '@angular/core';
import { BeneficiareService } from 'src/app/beneficiaires/beneficiare.service';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';
import { CohorteModel } from '../models/cohorte.model';

@Component({
  selector: 'app-cohorte-beneficaire-table',
  templateUrl: './cohorte-beneficaire-table.component.html',
  styleUrls: ['./cohorte-beneficaire-table.component.scss']
})
export class CohorteBeneficaireTableComponent implements OnInit {
  @Input() item: CohorteModel; 
  
  ELEMENT_DATA: BeneficiaireModel[] = []; 

  searchText: string; 

  constructor( 
    private beneficiareService: BeneficiareService, 
  ) {}

  ngOnInit() { 
    this.beneficiareService.getAllCohorte(this.item.id).subscribe(res => {
      this.ELEMENT_DATA = res;  
    });
  }
}
