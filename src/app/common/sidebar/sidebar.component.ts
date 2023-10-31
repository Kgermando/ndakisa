import { Component } from '@angular/core';
import { ToggleService } from '../header/toggle.service'; 
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { UserModel } from 'src/app/users/models/user.model';
import { Auth } from '../classes/auth';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    loading = false;
    currentUser: UserModel | any;
    

    panelOpenState = false;

    isToggled = false;

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void { 
        this.loading = true;
        Auth.userEmitter.subscribe(
            user => {
              this.currentUser = user;
            }
          );
        this.loading = false;
    }

    toggle() {
        this.toggleService.toggle();
    }

    toggleSidebarTheme() {
        this.themeService.toggleSidebarTheme();
    }

    toggleHideSidebarTheme() {
        this.themeService.toggleHideSidebarTheme();
    }

}