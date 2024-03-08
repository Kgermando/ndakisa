import { Component, HostListener } from '@angular/core';
import { ToggleService } from './toggle.service';
import { DatePipe } from '@angular/common'; 
import { AuthService } from 'src/app/auth/auth.service'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { Auth } from '../classes/auth';
import { UserModel } from 'src/app/users/models/user.model';
import { LogUserService } from 'src/app/logs/log-user.service';
import { NotificationService } from 'src/app/notification/notification.service';
import { NotificationModel } from 'src/app/notification/models/notification.model';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    isNotify = false;

    isToggled = false;

    loading = false;
    currentUser: UserModel | any;
 
    notificationList: any[] = [];
    isLoading: boolean = false;
    
    constructor(
        private toggleService: ToggleService,
        private datePipe: DatePipe,
        public themeService: CustomizerSettingsService,
        private authService: AuthService, 
        private logService: LogUserService,
        private notificationService: NotificationService
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
              this.isLoading = true;
                this.notificationService.getCurrentDate().subscribe(res => {
                    this.notificationList = res;
                    if (this.notificationList.length > 0) {
                        this.isNotify = true;
                        // console.log("notificationList", this.notificationList)
                    }
                    this.isLoading = false;
                });
              this.loading = false; 
            }
        );
    }
  
    logOut() {
        this.authService.logout().subscribe(res => {
            this.logService.createLog(
            this.currentUser.id,
            'Logout', 
            'User', 
            `${this.currentUser.prenom} ${this.currentUser.nom}`,
            'Déconnexion réussi.'
            ).subscribe(() => {
            console.log(res);
            localStorage.removeItem('jwt');
            localStorage.removeItem('roles');
               localStorage.clear();
            });
        });
    }




    toggleTheme() {
        this.themeService.toggleTheme();
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

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleHeaderTheme() {
        this.themeService.toggleHeaderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

    currentDate: Date = new Date();
    formattedDate: any = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy', 'fr-FR');

}