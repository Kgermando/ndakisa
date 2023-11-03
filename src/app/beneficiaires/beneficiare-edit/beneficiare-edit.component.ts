import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BanqueModel } from 'src/app/banques/models/banque.model';
import { ProvinceList } from 'src/app/shared/tools/province-list';
import { UserModel } from 'src/app/users/models/user.model';
import { BeneficiareService } from '../beneficiare.service';
import { BanqueService } from 'src/app/banques/banque.service';
import { ToastrService } from 'ngx-toastr';
import { BeneficiaireModel } from '../models/beneficiaire.model';

@Component({
  selector: 'app-beneficiare-edit',
  templateUrl: './beneficiare-edit.component.html',
  styleUrls: ['./beneficiare-edit.component.scss']
})
export class BeneficiareEditComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup; 

  currentUser: UserModel | any; 

  beneficiare: BeneficiaireModel;

  sexeList: string[] = [
    'Femme', 'Homme'
  ];

  provinceList: string[] = ProvinceList;
  banqueList: BanqueModel[] = [];

  id: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private beneficiareService: BeneficiareService,
    private banqueService: BanqueService,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.id = this.route.snapshot.params['id']; 
      this.formGroup = this._formBuilder.group({
        photo: [''],
        name_beneficiaire: [''],
        sexe: [''],  
        date_naissance: [''], 
        province: [''],
        identifiant: [''],
        email: [''],
        telephone: [''],
        raison_sociale: [''],
        secteur_activite: [''],
        numero_impot: [''],
        id_nat: [''],
        rccm: [''],
        adresse: [''], 
        montant_garantie: [''],
        credit_accorde: [''],
        interet: [''],
        montant_a_debourser: [''],
        delai_de_grace: [''],
        duree_credit: [''],
        date_valeur: [''],
        date_maturite: [''],
        date_de_rembousement: [''], 
        banque: [''], 
      });
  
      this.authService.user().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.banqueService.getAll().subscribe((res) => {
            this.banqueList = res;
          });
          this.beneficiareService.get(this.id).subscribe(item => { 
            this.beneficiare = item; 
              this.formGroup.patchValue({
                photo: item.photo,
                name_beneficiaire: this.capitalizeTest(item.name_beneficiaire),
                sexe: item.sexe, 
                date_naissance: item.date_naissance, 
                province: item.province, 
                identifiant: item.identifiant, 
                email: item.email, 
                telephone: item.telephone, 
                raison_sociale: this.capitalizeTest(item.raison_sociale),
                secteur_activite: item.secteur_activite, 
                numero_impot: item.numero_impot, 
                id_nat: item.id_nat, 
                rccm: item.rccm, 
                adresse: item.adresse,  
                montant_garantie: item.montant_garantie, 
                credit_accorde: item.credit_accorde, 
                interet: item.interet, 
                montant_a_debourser: item.montant_a_debourser, 
                delai_de_grace: item.delai_de_grace, 
                duree_credit: item.duree_credit, 
                date_valeur: item.date_valeur, 
                date_maturite: item.date_maturite, 
                date_de_rembousement: item.date_de_rembousement,  
                banque: item.banque,
                signature: this.currentUser.matricule, 
                update_created: new Date()
              });
            }
          );
        },
        error: (error) => {
          this.router.navigate(['/auth/login']);
          console.log(error);
        }
      });
  
  
    }
  

    onSubmit() {
      try {
        this.isLoading = true;
        this.beneficiareService.update(this.id, this.formGroup.getRawValue())
        .subscribe({
          next: () => {
            this.toastr.success('Modification enregistré!', 'Success!');
            this.router.navigate(['/layouts/beneficiaires/beneficiaire-list']);
            this.isLoading = false;
          },
          error: err => {
            console.log(err);
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            this.isLoading = false;
          }
        }); 
      } catch (error) {
        this.isLoading = false;
        console.log(error);
      }
    }

  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }
}
