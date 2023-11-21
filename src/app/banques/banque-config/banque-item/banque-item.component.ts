import { Component, Input } from '@angular/core';
import { BanqueModel } from '../../models/banque.model';
import { UserModel } from 'src/app/users/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { LogUserService } from 'src/app/logs/log-user.service';
import { BanqueService } from '../../banque.service';
import { Router } from '@angular/router';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';

@Component({
  selector: 'app-banque-item',
  templateUrl: './banque-item.component.html',
  styleUrls: ['./banque-item.component.scss']
})
export class BanqueItemComponent {
  @Input() item: BanqueModel;
  @Input() currentUser: UserModel;

  banque: BanqueModel;
  beneficiaireList: BeneficiaireModel[] = [];
  
  constructor(
    private router: Router,
    private banqueService: BanqueService,
    private logService: LogUserService,
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.banqueService.get(this.item.id).subscribe(res => {
      this.banque = res;
      this.beneficiaireList = this.banque.beneficiaires;  
    });
  }




  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.logService.createLog(
        this.currentUser.id, 
        'Delete',
        'Banque', 
        `${this.item.name_banque}`, 
        'Suppression de la banque.'
      ).subscribe(() => {
        this.banqueService
        .delete(id)
        .subscribe({
          next: () => {
            this.toastr.info('Supprimé avec succès!', 'Success!');
            this.router.navigate(['/layouts/banques/config']);
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
