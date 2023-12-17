import { Component, Input, OnInit } from '@angular/core';
import { BanqueModel } from '../models/banque.model';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';
import { BeneficiareService } from 'src/app/beneficiaires/beneficiare.service';

@Component({
  selector: 'app-banque-beneficaire-table',
  templateUrl: './banque-beneficaire-table.component.html',
  styleUrls: ['./banque-beneficaire-table.component.scss']
})
export class BanqueBeneficaireTableComponent implements OnInit {
  @Input() item: BanqueModel; 
  
  ELEMENT_DATA: BeneficiaireModel[] = []; 

  searchText: string; 

  constructor( 
    private beneficiareService: BeneficiareService, 
  ) {}

  ngOnInit() { 
    this.beneficiareService.getAllBanque(this.item.id).subscribe(res => {
      this.ELEMENT_DATA = res; 
    });
  }
}