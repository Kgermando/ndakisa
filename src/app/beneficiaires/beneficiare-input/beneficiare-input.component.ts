import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BeneficiaireModel } from '../models/beneficiaire.model'; 

@Component({
  selector: 'app-beneficiare-input',
  templateUrl: './beneficiare-input.component.html',
  styleUrls: ['./beneficiare-input.component.scss']
})
export class BeneficiareInputComponent implements OnChanges {
  @Input('ELEMENT_DATA') ELEMENT_DATA: BeneficiaireModel[] = []; 

  
  searchText: string; 

  ngOnChanges(changes: SimpleChanges): void { 
    console.log('ELEMENT_DATA', this.ELEMENT_DATA) 
  } 

 
}
