import { Component, Input, OnInit } from '@angular/core';
import { SecteurModel } from '../models/secteur.model';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';
import { BeneficiareService } from 'src/app/beneficiaires/beneficiare.service';

@Component({
  selector: 'app-secteur-beneficiare-table',
  templateUrl: './secteur-beneficiare-table.component.html',
  styleUrls: ['./secteur-beneficiare-table.component.scss']
})
export class SecteurBeneficiareTableComponent implements OnInit {
  @Input() item: SecteurModel; 
  
  ELEMENT_DATA: BeneficiaireModel[] = []; 

  searchText: string; 

  constructor( 
    private beneficiareService: BeneficiareService, 
  ) {}

  ngOnInit() { 
    this.beneficiareService.getAllSecteur(this.item.id).subscribe(res => {
      this.ELEMENT_DATA = res; 
    });
  }
}