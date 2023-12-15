import { Component, OnInit } from '@angular/core';
import { CorbelService } from './corbel.service';
import { CorbeilModel } from './models/corbeil.model';
import { LogUserService } from '../logs/log-user.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../users/models/user.model';
import { BeneficiareService } from '../beneficiaires/beneficiare.service';
import { ToastrService } from 'ngx-toastr';
import { CohorteService } from '../cohortes/cohorte.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-corbeil',
  templateUrl: './corbeil.component.html',
  styleUrls: ['./corbeil.component.scss']
})
export class CorbeilComponent implements OnInit {

  isLoading = false;

  currentUser: UserModel | any; 

  corbeilList: CorbeilModel[] = [];

  constructor( private authService: AuthService,
    private router: Router,
    private corbeilService: CorbelService,
    private logService: LogUserService,
    private cohorteService: CohorteService,
    private beneficiareService: BeneficiareService,
    private userService: UserService,
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
       
        this.corbeilService.getAllCohorte().subscribe(cohortes => {
          var cohorteList = cohortes;
          this.corbeilList.push(...cohorteList);
          this.corbeilService.getAllBeneficiaire().subscribe(beneficiaire => {
            var beneficiaireList = beneficiaire;
            this.corbeilList.push(...beneficiaireList);
            this.corbeilService.getAllUser().subscribe(user => {
              var userList = user;
              this.corbeilList.push(...userList);
              console.log('cohorteList', cohorteList); 
              console.log('beneficiaireList', beneficiaireList); 
              console.log('userList', userList); 
              console.log('corbeilList', this.corbeilList);
              this.isLoading = false;
            });
          });
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
  }

  restaurer(id: number, type: string, title: string) {
    if (confirm('Êtes-vous sûr de restituer ce document ?')) {
      if (type == 'Cohorte') {
        this.logService.createLog(
          this.currentUser.id, 
          'Restitution', 
          'Cohorte', 
          `${title}`, 
          'Restitution de la cohorte.'
        ).subscribe(() => {
          var body = {
            is_delete: false,
            update_created: new Date(),
          };
          this.cohorteService
          .update(id, body)
          .subscribe({
            next: () => {
              this.toastr.info('Restitution effectué!', 'Success!');
              this.router.navigate(['layouts/cohortes/cohorte-list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            }
          })
        }
       );
      } else if (type == 'Beneficiaire') {
        this.logService.createLog(
          this.currentUser.id,
          'Restitution', 
          'Beneficiaire', 
          `${title}`,
          'Restitution du Beneficiaire'
        ).subscribe(() => {
          var body = {
            is_delete: false,
            update_created: new Date(),
          };
          this.beneficiareService
          .update(id, body)
          .subscribe({
            next: () => {
              this.toastr.info('Restitution effectué!', 'Success!');
              this.router.navigate(['/layouts/beneficiaires/beneficiaire-list']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          });
        });
        
      } else if (type == 'Utilisateur') {
        this.logService.createLog(
          this.currentUser.id, 
          'Restitution', 
          'User', 
          `${title}`,
          'Restitution de l\'utilisateur.'
        ).subscribe(() => {
          var body = {
            is_delete: true,
            update_created: new Date(),
          };
          this.userService
          .update(id, body)
          .subscribe({
            next: () => {
              this.toastr.info('Restitution effectué!', 'Success!');
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
  }

  delete(id: number, type: string, title: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document définitivement ?')) {
      if (type == 'Cohorte') {
        this.logService.createLog(
          this.currentUser.id, 
          'Delete', 
          'Cohorte', 
          `${title}`, 
          'Suppression de la cohorte.'
        ).subscribe(() => this.cohorteService
        .delete(id) 
        .subscribe({
          next: () => {
            this.toastr.info('Success!', 'Supprimé avec succès!');
            this.router.navigate(['layouts/corbeil']); 
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          }
        }));

      } else if (type == 'Beneficiaire') {
        this.logService.createLog(
          this.currentUser.id,
          'Delete', 
          'Beneficiaire', 
          `${title}`, 
          'Suppression du Beneficiaire'
        ).subscribe(() => {
          this.beneficiareService
          .delete(id)
          .subscribe({ 
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/layouts/corbeil']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          });
        });
      } else if (type == 'Utilisateur') {
        this.logService.createLog(
          this.currentUser.id, 
          'Delete', 
          'Utilisateur',
          `${title}`,
          'Suppression de l\'utilisateur.'
        ).subscribe(() => {
          this.userService
          .delete(id) 
          .subscribe({
            next: () => {
              this.toastr.info('Supprimé avec succès!', 'Success!');
              this.router.navigate(['/layouts/corbeil']);
            },
            error: err => {
              this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
              console.log(err);
            }
          });
        });
      }
    }
  }

  

  

}
