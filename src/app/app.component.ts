import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToggleService } from './common/header/toggle.service';
import { CustomizerSettingsService } from './common/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ndakisa';

  isToggled = false;

  constructor(
      public router: Router,
      private toggleService: ToggleService,
      public themeService: CustomizerSettingsService
  ) {
    this.toggleService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
    });
  }

  toggleRightSidebarTheme() {
      this.themeService.toggleRightSidebarTheme();
  }

  toggleHideSidebarTheme() {
      this.themeService.toggleHideSidebarTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleTheme() {
      this.themeService.toggleTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }

}
