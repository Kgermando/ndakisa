import { Component, OnInit } from '@angular/core';
import { SupportModel } from '../models/support.model'; 
import { ActivatedRoute, Router } from '@angular/router';
import { SupportService } from '../support.service';
import { ToastrService } from 'ngx-toastr';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { UserModel } from 'src/app/users/models/user.model';
import { Auth } from 'src/app/common/classes/auth';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-support-documentation',
  templateUrl: './support-documentation.component.html',
  styleUrls: ['./support-documentation.component.scss']
})
export class SupportDocumentationComponent implements OnInit {
  isLoading = false;

  support: SupportModel;

  currentUser: UserModel | any;

  id: any;

  constructor(
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router, 
    private authService: AuthService, 
    private supportService: SupportService, 
    private toastr: ToastrService,
) {}


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isLoading = true;
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.supportService.get(this.id).subscribe((item) => {
          this.support = item;
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


  edit(id:number) {
    this.router.navigate(['/layouts/helps/support/', id, 'edit']);
  }


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.supportService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Success!', 'Supprimé avec succès!'); 
            this.router.navigate(['/layouts/helps/support']);
          },
          error: err => {
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          }
        }
      );
    }
  }

}
