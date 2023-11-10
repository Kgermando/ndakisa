import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { BeneficiareService } from '../beneficiare.service';
import { UserModel } from 'src/app/users/models/user.model';
import { ProvinceList } from 'src/app/shared/tools/province-list';
import { BanqueModel } from 'src/app/banques/models/banque.model';
import { BanqueService } from 'src/app/banques/banque.service';
import { PlanRemboursementModel } from '../models/plan_remousement.model';
import { BeneficiaireModel } from '../models/beneficiaire.model';

@Component({
  selector: 'app-beneficiare-add',
  templateUrl: './beneficiare-add.component.html',
  styleUrls: ['./beneficiare-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BeneficiareAddComponent implements OnInit {
  isLoading: boolean = false;
  isLoadingPlanRemboursement: boolean = false; 

  formGroup!: FormGroup;
  formGroup2!: FormGroup;
  formGroup3!: FormGroup; 

  currentUser: UserModel | any; 
 
  sexeList: string[] = [
    'Femme', 'Homme'
  ];

  provinceList: string[] = ProvinceList;
  banqueList: BanqueModel[] = [];
  beneficiareList: BeneficiaireModel[] = [];
  planRemboursementList: PlanRemboursementModel[] = [];

  id: any;

  id_beneficiaire: any;

  identifiant: string = '-';

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
        this.beneficiareService.getAll().subscribe((res) => {
          this.beneficiareList = res;
          }
        );
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
      // identifiant: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
      raison_sociale: ['', Validators.required],
      secteur_activite: ['', Validators.required],
      numero_impot: ['', Validators.required],
      id_nat: ['', Validators.required],
      rccm: ['', Validators.required],
      adresse: ['', Validators.required],
    });
  }
 

  onChange(event: any) {
    // B-001-00001 
    var beneficiaire = this.beneficiareList.length + 1;
    var numero: string = '';
    if (beneficiaire >= 0 && beneficiaire <= 9) {
      numero = `0000${beneficiaire}`; 
    } else if (beneficiaire > 9 && beneficiaire <= 99) {
      numero = `000${beneficiaire}`; 
    } else if (beneficiaire > 99 && beneficiaire <= 999) {
      numero = `00${beneficiaire}`; 
    } else if (beneficiaire > 999 && beneficiaire <= 9999) {
      numero = `0${beneficiaire}`; 
    } else if (beneficiaire > 9999 && beneficiaire <= 99999) {
      numero = `${beneficiaire}`; 
    }
 
    if (event.value === 'Bas-Uele') {
      this.identifiant = `B-01-${numero}`;
    } else if (event.value === 'Equateur') {
      this.identifiant = `B-02-${numero}`;
    } else if (event.value === 'Haut-Lomami') {
      this.identifiant = `B-03-${numero}`;
    } else if (event.value === 'Haut-Katanga') {
      this.identifiant = `B-04-${numero}`;
    } else if (event.value === 'Haut-Uele') {
      this.identifiant = `B-05-${numero}`;
    } else if (event.value === 'Ituri') {
      this.identifiant = `B-06-${numero}`;
    } else if (event.value === 'Kasaï') {
      this.identifiant = `B-07-${numero}`;
    } else if (event.value === 'Kasaï Central') {
      this.identifiant = `B-08-${numero}`;
    } else if (event.value === 'Kasaï Oriental') {
      this.identifiant = `B-09-${numero}`;
    } else if (event.value === 'Kinshasa') {
      this.identifiant = `B-010-${numero}`;
    } else if (event.value === 'Kongo Central') {
      this.identifiant = `B-011-${numero}`;
    } else if (event.value === 'Kwango') {
      this.identifiant = `B-012-${numero}`;
    } else if (event.value === 'Kwilu') {
      this.identifiant = `B-013-${numero}`;
    } else if (event.value === 'Lualaba') {
      this.identifiant = `B-014-${numero}`;
    } else if (event.value === 'Lomani') {
      this.identifiant = `B-015-${numero}`;
    } else if (event.value === 'Maniema') {
      this.identifiant = `B-016-${numero}`;
    } else if (event.value === 'Mai-Ndombe') {
      this.identifiant = `B-017-${numero}`;
    } else if (event.value === 'Mongala') {
      this.identifiant = `B-018-${numero}`;
    } else if (event.value === 'Nord Kivu') {
      this.identifiant = `B-019-${numero}`;
    } else if (event.value === 'Nord-Ubangui') {
      this.identifiant = `B-020-${numero}`;
    } else if (event.value === 'Sankuru') {
      this.identifiant = `B-021-${numero}`;
    } else if (event.value === 'Sud Kivu') {
      this.identifiant = `B-022-${numero}`;
    } else if (event.value === 'Sud-Ubangui') {
      this.identifiant = `B-023-${numero}`;
    } else if (event.value === 'Tanganyika') {
      this.identifiant = `B-024-${numero}`;
    } else if (event.value === 'Tshopo') {
      this.identifiant = `B-025-${numero}`;
    } else if (event.value === 'Tshuapa') {
      this.identifiant = `B-026-${numero}`;
    } 
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
          identifiant: this.identifiant, 
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
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
            this.router.navigate(['/layouts/beneficiaires', res.id, 'beneficiaire-edit']); 
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
