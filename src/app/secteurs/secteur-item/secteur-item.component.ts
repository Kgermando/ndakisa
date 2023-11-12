import { Component, Input, OnInit } from '@angular/core';
import { SecteurModel } from '../models/secteur.model';
import { SecteurService } from '../secteur.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';

@Component({
  selector: 'app-secteur-item',
  templateUrl: './secteur-item.component.html',
  styleUrls: ['./secteur-item.component.scss']
})
export class SecteurItemComponent implements OnInit {
  @Input() item: SecteurModel;

  secteur: SecteurModel;
  beneficiaireList: BeneficiaireModel[] = [];
  
  constructor(
    private router: Router,
    private secteurService: SecteurService,
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.secteurService.get(this.item.id).subscribe(res => {
      this.secteur = res;
      this.beneficiaireList = this.secteur.beneficiaires;  
    });

    // this.beneficiaireList = this.item.beneficiaires;

    console.log('list', this.beneficiaireList)
  }




  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
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
    }
  }

}
