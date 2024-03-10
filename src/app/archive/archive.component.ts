import { Component, OnInit } from '@angular/core';
import { ArchiveModel } from './models/archive.model';
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings.service';
import { ArchiveService } from './archive.service';
import { LogUserService } from '../logs/log-user.service';
import { UserModel } from '../users/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  isLoading = false; 
  archiveList: ArchiveModel[] = [];
 
  lastPage: number | any; 
  currentUser: UserModel;

  constructor(
    public themeService: CustomizerSettingsService,   
    private router: Router, 
    private authService: AuthService,
    private archiveService: ArchiveService, 
    private logService: LogUserService,
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;  
        this.archiveService.refreshDataList$.subscribe(() => {
          this.getAllData();
        });
        this.getAllData();  
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });
    
  }

  getAllData(page = 1) {
    this.isLoading = true;
    this.archiveService.all(page).subscribe((res) => {
        this.archiveList = res.data;
        this.lastPage = res.meta.last_page;
        this.isLoading = false;
      }
    );
  }


  downloadURL(url: string) {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = url;
    link.download = 'model_de_remboursement.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
 


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.logService.createLog(
        this.currentUser.id, 
        'Delete',
        'Archive', 
        `Numero ${id}`, 
        'Suppression de l\'archive.'
      ).subscribe(() => {
        this.archiveService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Supprimé avec succès!', 'Success!');
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
