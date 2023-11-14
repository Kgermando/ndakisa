import { Component, Input, OnInit } from '@angular/core';
import { SecteurModel } from '../models/secteur.model';
import { SecteurService } from '../secteur.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';
import { UserModel } from 'src/app/users/models/user.model';
import { LogUserService } from 'src/app/users/log-user.service';

@Component({
  selector: 'app-secteur-item',
  templateUrl: './secteur-item.component.html',
  styleUrls: ['./secteur-item.component.scss']
})
export class SecteurItemComponent implements OnInit {
  @Input() item: SecteurModel;
  @Input() currentUser: UserModel;

  secteur: SecteurModel;
  beneficiaireList: BeneficiaireModel[] = [];
  
  constructor(
    private router: Router,
    private secteurService: SecteurService,
    private logService: LogUserService,
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.secteurService.get(this.item.id).subscribe(res => {
      this.secteur = res;
      this.beneficiaireList = this.secteur.beneficiaires;  
    });
  }




  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.logService.createLog(
        this.currentUser.id, 
        'Delete',
        'Secteur', 
        `${this.item.name_secteur}`, 
        'Suppression du secteur d\'activité.'
      ).subscribe(() => {
        this.secteurService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Supprimé avec succès!', 'Success!');
            this.router.navigate(['/layouts/beneficiaires/secteur-list']);
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
