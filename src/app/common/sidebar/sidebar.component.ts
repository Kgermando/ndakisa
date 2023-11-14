import { Component } from '@angular/core';
import { ToggleService } from '../header/toggle.service'; 
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service'; 
import { Auth } from '../classes/auth';
import { BanqueService } from 'src/app/banques/banque.service';
import { BanqueModel } from 'src/app/banques/models/banque.model';
import { CreateBanqueDialogBox } from 'src/app/banques/banque-list/banque-list.component';
import { MatDialog } from '@angular/material/dialog';
import { UserModel } from 'src/app/users/models/user.model';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    loading = false;
    currentUser: UserModel | any;

    banqueList: BanqueModel[] = [];
    
    panelOpenState = false;

    isToggled = false;

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private banqueService: BanqueService, 
        public dialog: MatDialog, 
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
              this.banqueService.refreshDataList$.subscribe(() => {
                this.getAllData();
              });
              this.getAllData();
            }
          );
        this.loading = false;
    }

    getAllData() {
        this.banqueService.getAllNav().subscribe((res) => {
            this.banqueList = res;
          }
        );
    }


    openCreateDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
        this.dialog.open(CreateBanqueDialogBox, {
          width: '600px',
          enterAnimationDuration,
          exitAnimationDuration, 
        }); 
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