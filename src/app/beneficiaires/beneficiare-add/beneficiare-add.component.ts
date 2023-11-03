import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { BeneficiareService } from '../beneficiare.service';
import { UserModel } from 'src/app/users/models/user.model';
import { ProvinceList } from 'src/app/shared/tools/province-list';
import { BanqueModel } from 'src/app/banques/models/banque.model';
import { BanqueService } from 'src/app/banques/banque.service';

@Component({
  selector: 'app-beneficiare-add',
  templateUrl: './beneficiare-add.component.html',
  styleUrls: ['./beneficiare-add.component.scss']
})
export class BeneficiareAddComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;
  formGroup2!: FormGroup;
  formGroup3!: FormGroup; 

  currentUser: UserModel | any; 
 
  sexeList: string[] = [
    'Femme', 'Homme'
  ];

  provinceList: string[] = ProvinceList;
  banqueList: BanqueModel[] = [];

  id: any;

  id_beneficiaire: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private beneficiareService: BeneficiareService,
    private banqueService: BanqueService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.banqueService.getAll().subscribe((res) => {
          this.banqueList = res;
        });
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({
      photo: [''],
      name_beneficiaire: ['', Validators.required],
      sexe: ['', Validators.required],  
      date_naissance: ['', Validators.required], 
      province: ['', Validators.required],
      identifiant: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
      raison_sociale: ['', Validators.required],
      secteur_activite: ['', Validators.required],
      numero_impot: ['', Validators.required],
      id_nat: ['', Validators.required],
      rccm: ['', Validators.required],
      adresse: ['', Validators.required],
    });

    this.formGroup2 = this._formBuilder.group({
      banque: [''],
      montant_garantie: [''],
      credit_accorde: [''],
      interet: [''],
      montant_a_debourser: [''], 
      delai_de_grace: [''],
      duree_credit: [''],
      date_valeur: [''],
      date_maturite: [''],
      delai_de_reajustement: [''],
    });

    this.formGroup3 = this._formBuilder.group({
      date_de_rembousement: [''],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          photo: this.formGroup.value.photo,
          name_beneficiaire: this.capitalizeTest(this.formGroup.value.name_beneficiaire),
          sexe: this.formGroup.value.sexe,
          date_naissance: this.formGroup.value.date_naissance,
          province: this.formGroup.value.province,
          identifiant: this.formGroup.value.identifiant.toLowerCase(), 
          email: this.formGroup.value.email,
          telephone: this.formGroup.value.telephone,
          raison_sociale: this.capitalizeTest(this.formGroup.value.raison_sociale), 
          secteur_activite: this.capitalizeTest(this.formGroup.value.secteur_activite),
          numero_impot: this.formGroup.value.numero_impot, 
          id_nat: this.formGroup.value.id_nat,
          rccm: this.formGroup.value.rccm,
          adresse: this.formGroup.value.adresse,
          cohorte: this.id, 
          statut:  'En cours', 
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.beneficiareService.create(body).subscribe({
          next: (res) => {
            this.id_beneficiaire = res.id;
            console.log('id_beneficiaire', this.id_beneficiaire);
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            // this.router.navigate(['/layouts/cohortes/cohorte-list']);
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      } 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmit2() {
    try {
      if (this.formGroup2.valid) {
        this.isLoading = true;
        var body = {
          montant_garantie: this.formGroup2.value.montant_garantie,
          credit_accorde: this.formGroup2.value.credit_accorde,
          interet: this.formGroup2.value.interet,
          montant_a_debourser: this.formGroup2.value.montant_a_debourser, 
          delai_de_grace: this.formGroup2.value.delai_de_grace,
          duree_credit: this.formGroup2.value.duree_credit,
          date_valeur: this.formGroup2.value.date_valeur,
          date_maturite: this.formGroup2.value.date_maturite,
          delai_de_reajustement: this.formGroup2.value.delai_de_reajustement,
          banque: this.formGroup2.value.banque, 
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.beneficiareService.update(this.id_beneficiaire, body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup2.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            // this.router.navigate(['/layouts/cohortes/cohorte-list']);
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      } 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmit3() {
    try {
      if (this.formGroup3.valid) {
        this.isLoading = true;
        var body = {
          date_de_rembousement: this.formGroup3.value.date_de_rembousement, 
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.beneficiareService.update(this.id_beneficiaire, body).subscribe({
          next: () => {
            this.isLoading = false;
            this.formGroup3.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/layouts/cohortes/cohorte-list']);
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      } 
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }

}
