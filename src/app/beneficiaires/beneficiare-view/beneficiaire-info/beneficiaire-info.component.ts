import { Component, Input } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { BeneficiaireModel } from '../../models/beneficiaire.model';

@Component({
  selector: 'app-beneficiaire-info',
  templateUrl: './beneficiaire-info.component.html',
  styleUrls: ['./beneficiaire-info.component.scss']
})
export class BeneficiaireInfoComponent {
  @Input('beneficiaire') beneficiaire: BeneficiaireModel;
  
    constructor(
      public themeService: CustomizerSettingsService
  ) {}

  toggleTheme() {
      this.themeService.toggleTheme();
  }
}
