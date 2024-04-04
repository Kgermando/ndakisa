import { Component, OnInit } from '@angular/core';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../models/user.model';
import { LogUserService } from '../../logs/log-user.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  isLoading = false;

  user: UserModel | any;

  currentUser: UserModel | any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private logService: LogUserService,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.isLoading = true;
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          let id = this.route.snapshot.paramMap.get('id');  // this.route.snapshot.params['id'];
          this.userService.get(Number(id)).subscribe(res => {
            this.user = res;
            this.isLoading = false;
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
    }

    delete(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
        this.logService.createLog(
          this.currentUser.id, 
          'Delete', 
          'User', 
          `${this.user.prenom} ${this.user.nom}`,
          'Mise en corbeil de l\'utilisateur.'
        ).subscribe(() => {
          var body = {
            is_delete: true,
            update_created: new Date(),
          };
          this.userService
          .update(id, body)
          .subscribe({
            next: () => {
              this.toastr.info('Mise en corbeil avec succès!', 'Success!');
              this.router.navigate(['/layouts/users/user-list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          });
        });
        
      }
    }
   
      
    // delete(id: number): void {
    //   if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
    //     this.logService.createLog(
    //       this.currentUser.id, 
    //       'Delete', 
    //       'User', 
    //       `${this.user.prenom} ${this.user.nom}`,
    //       'Suppression de l\'utilisateur.'
    //     ).subscribe(() => {
    //       this.userService
    //       .delete(id) 
    //       .subscribe({
    //         next: () => {
    //           this.toastr.info('Supprimé avec succès!', 'Success!');
    //           this.router.navigate(['/layouts/users/user-list']);
    //         },
    //         error: err => {
    //           this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
    //           console.log(err);
    //         }
    //       });
    //     });
        
    //   }
    // }
   
  
    toggleTheme() {
      this.themeService.toggleTheme();
    }
  
}
