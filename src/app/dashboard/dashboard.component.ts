import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  dateRange!: FormGroup;

  constructor(
    public themeService: CustomizerSettingsService  
  ) {}



  toggleTheme() {
      this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }
}
