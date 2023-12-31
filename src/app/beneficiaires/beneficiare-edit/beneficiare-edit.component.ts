import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { BeneficiareService } from '../beneficiare.service';
import { UserModel } from 'src/app/users/models/user.model';
import { ProvinceList } from 'src/app/shared/tools/province-list';
import { BanqueModel } from 'src/app/banques/models/banque.model';
import { BanqueService } from 'src/app/banques/banque.service';
import { PlanRemboursementService } from '../plan_remboursement.service';
import { PlanRemboursementModel } from '../models/plan_remousement.model';
import { BeneficiaireModel } from '../models/beneficiaire.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LogUserService } from 'src/app/logs/log-user.service';
import { SecteurModel } from '../../secteurs/models/secteur.model';
import { SecteurService } from '../../secteurs/secteur.service';

@Component({
  selector: 'app-beneficiare-edit',
  templateUrl: './beneficiare-edit.component.html',
  styleUrls: ['./beneficiare-edit.component.scss']
})
export class BeneficiareEditComponent implements OnInit {
  isLoading: boolean = false;
  isLoadingPlanRemboursement: boolean = false; 

  formGroup!: FormGroup;
  formGroup2!: FormGroup;
  formGroup3!: FormGroup; 


  currentUser: UserModel | any; 
  beneficiare: BeneficiaireModel;
 
  sexeList: string[] = [
    'Femme', 'Homme'
  ];

  provinceList: string[] = ProvinceList;
  banqueList: BanqueModel[] = [];
  planRemboursementList: PlanRemboursementModel[] = [];
  secteurList: SecteurModel[] = [];
  systemeRemboursementList: string[] = ['Lineaire', 'Progressif']

  id: any; 
  banqueId: any;
  duree_credit = 0;

  systeme_remboursement: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private beneficiareService: BeneficiareService,
    private planRemboursement: PlanRemboursementService,
    private banqueService: BanqueService,
    private logService: LogUserService,
    private secteurService: SecteurService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}

  onChangeBanque(event: any) {
    // this.banqueId = event.value;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
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
    });

    this.formGroup2 = this._formBuilder.group({
      banque: [''],
      compte_bancaire: [''],
      montant_garantie: [''],
      credit_accorde: [''],
      interet_beneficiaire: [''],
      // montant_a_debourser: [''], 
      delai_de_grace: [''],
      duree_credit: [''],
      date_soumission: [''],
      date_valeur: [''],
      date_maturite: [''],
      systeme_remboursement: [''],
    });

    this.formGroup3 = this._formBuilder.group({
      date_de_rembousement: ['', Validators.required],
      credit_en_debut_periode: ['', Validators.required],
      // mensualite: ['', Validators.required],
      interet: ['', Validators.required],
      capital: ['', Validators.required],
    });
 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.banqueService.getAll().subscribe((res) => {
          this.banqueList = res;
        });
        this.secteurService.getAll().subscribe((res) => {
          this.secteurList = res;
        });
        this.beneficiareService.get(this.id).subscribe(item => {
          this.beneficiare = item;
          this.planRemboursement.refreshDataList$.subscribe(() => {
            this.getAllData(this.beneficiare.id);
          });
          this.getAllData(this.beneficiare.id); 
          
          this.formGroup.patchValue({
            photo: item.photo,
            name_beneficiaire: item.name_beneficiaire,
            sexe: item.sexe,
            date_naissance: item.date_naissance,
            province: item.province,
            identifiant: item.identifiant,
            email: item.email,
            telephone: item.telephone,
            raison_sociale: item.raison_sociale,
            secteur_activite: item.secteur_activite,
            numero_impot: item.numero_impot,
            id_nat: item.id_nat,
            rccm: item.rccm,
            adresse: item.adresse,
          });
          this.formGroup2.patchValue({
            banque: item.banque,
            compte_bancaire: item.compte_bancaire,
            montant_garantie: item.montant_garantie,
            credit_accorde: item.credit_accorde,
            interet_beneficiaire: item.interet_beneficiaire, 
            delai_de_grace: item.delai_de_grace,
            duree_credit: item.duree_credit,
            date_soumission: item.date_soumission,
            date_valeur: item.date_valeur,
            date_maturite: item.date_maturite,
            delai_de_reajustement: item.delai_de_reajustement, 
            systeme_remboursement: item.systeme_remboursement,
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          }); 

          this.duree_credit = item.duree_credit;
          this.systeme_remboursement = item.systeme_remboursement;


          this.formGroup2.valueChanges.subscribe(val => {
            this.duree_credit = +val.duree_credit;
            this.systeme_remboursement = val.systeme_remboursement;
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

  getAllData(id: number) {
    this.planRemboursement.getAllData(id).subscribe((res) => {
        this.planRemboursementList = res;
      }
    );
  } 
 

  onSubmit() {
    try {
      this.isLoading = true; 
        this.beneficiareService.update(this.id, this.formGroup.getRawValue()).subscribe({
          next: () => { 
            this.logService.createLog(
              this.currentUser.id, 
              'Update', 
              'Beneficiaire', 
              `${this.beneficiare.name_beneficiaire}`,
              'Modification des infos du Beneficiaire.'
            ).subscribe(
              () => {
                this.isLoading = false;
                this.formGroup.reset();
                this.toastr.success('Modification effectuée!', 'Success!');
                // this.router.navigate(['/layouts/cohortes/cohorte-list']);
              }
            );
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onSubmit2() {
    try {
      this.isLoading = true;
      var body = {
        banque: this.formGroup2.value.banque,
        compte_bancaire: this.formGroup2.value.compte_bancaire,
        montant_garantie: this.formGroup2.value.montant_garantie,
        credit_accorde: this.formGroup2.value.credit_accorde,
        interet_beneficiaire: this.formGroup2.value.interet_beneficiaire,
        montant_a_debourser: parseFloat(this.formGroup2.value.credit_accorde) + parseFloat(this.formGroup2.value.interet_beneficiaire), 
        delai_de_grace: this.formGroup2.value.delai_de_grace,
        duree_credit: this.formGroup2.value.duree_credit,
        date_soumission: this.formGroup2.value.date_soumission,
        date_valeur: this.formGroup2.value.date_valeur,
        date_maturite: this.formGroup2.value.date_maturite,
        delai_de_reajustement: this.formGroup2.value.delai_de_reajustement,
        statut: 'En cours',
        systeme_remboursement: this.formGroup2.value.systeme_remboursement,
        signature: this.currentUser.matricule, 
        update_created: new Date(),
      };
      this.beneficiareService.update(this.id, body).subscribe({
        next: (res) => {
          this.banqueId = res.banque.id
          this.duree_credit = res.duree_credit;
          this.systeme_remboursement = res.systeme_remboursement;
          
          this.logService.createLog(
            this.currentUser.id, 
            'Update', 
            'Beneficiaire', 
            `${this.beneficiare.name_beneficiaire}`,
            'Modification des infos du Beneficiaire.'
          ).subscribe(
            () => {
              this.isLoading = false;
              this.formGroup.reset();
              this.toastr.success('Modification effectuée!', 'Success!');
              // this.router.navigate(['/layouts/cohortes/cohorte-list']);
            }
          );
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
          console.log(err);
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  onChange(event: any) {
    this.systeme_remboursement = event.value;
  }

  onSubmit3() {
    try {
      if (this.formGroup3.valid) {
        if (this.duree_credit > 0) {
          if (this.systeme_remboursement == 'Lineaire') {
            this.isLoadingPlanRemboursement = true;
            for (let index = 0; index < this.duree_credit; index++) {

              var date_de_rembousement = new Date(this.formGroup3.value.date_de_rembousement);
              date_de_rembousement.setDate(date_de_rembousement.getDate() + (30 * index));

              var mensualite =  parseFloat(this.formGroup3.value.interet) + parseFloat(this.formGroup3.value.capital);
              var credit_en_debut_periode = parseFloat(this.formGroup3.value.credit_en_debut_periode) - (mensualite * index);
  
              console.log('cohorte', this.beneficiare.cohorte.id);
              console.log('banqueId', this.banqueId);
              console.log('secteur_activite', this.beneficiare.secteur_activite.id);
              if (!this.banqueId) {
                this.banqueId = this.beneficiare.banque.id;
                console.log('banque', this.beneficiare.banque.id);
              }

              var body = {
                cohorte: this.beneficiare.cohorte.id,
                banque: this.banqueId,
                beneficiaire: this.beneficiare.id,
                secteur_activite: this.beneficiare.secteur_activite.id,
                date_de_rembousement: date_de_rembousement,
                credit_en_debut_periode: credit_en_debut_periode,
                interet: this.formGroup3.value.interet,
                capital: this.formGroup3.value.capital,
                signature: this.currentUser.matricule,
                created: new Date(),
                update_created: new Date(),
              };
              this.planRemboursement.create(body).subscribe(res => {
                console.log('body', res);
              });
            }
            this.logService.createLog(
              this.currentUser.id, 
              'Create', 
              'Plan de remboursement', 
              `${this.beneficiare.name_beneficiaire}`, 
              'Création du plan de remboursement'
            ).subscribe(() => {
              this.isLoadingPlanRemboursement = false;
              this.formGroup3.reset();
              this.toastr.success('Ajouter avec succès!', 'Success!');
            }); 

          } else if (this.systeme_remboursement == 'Progressif') {
            this.isLoadingPlanRemboursement = true;
            var body2 = {
              cohorte: this.beneficiare.cohorte.id,
              banque: this.beneficiare.banque.id,
              beneficiaire: this.beneficiare.id,
              secteur_activite: this.beneficiare.secteur_activite.id,
              date_de_rembousement: this.formGroup3.value.date_de_rembousement,
              credit_en_debut_periode: this.formGroup3.value.credit_en_debut_periode,
              interet: this.formGroup3.value.interet,
              capital: this.formGroup3.value.capital,
              signature: this.currentUser.matricule,
              created: new Date(),
              update_created: new Date(),
            };
            this.planRemboursement.create(body2).subscribe(res => {
              this.logService.createLog(
                this.currentUser.id, 
                'Create', 
                'Plan de remboursement', 
                `${this.beneficiare.name_beneficiaire}`, 
                'Création du plan de remboursement'
              ).subscribe(() => {
                this.isLoadingPlanRemboursement = false;
                this.formGroup3.reset();
                this.toastr.success('Ajouter avec succès!', 'Success!');
              }); 

            });
          } 
        }
      }  
    } catch (error) {
      this.isLoadingPlanRemboursement = false;
      console.log(error);
    }
  }

  terminer(id: number) {
    this.router.navigate(['layouts/beneficiaires', id, 'beneficiaire-view']);
  }

  deleteItem(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet ligne ?')) {
      this.logService.createLog(
        this.currentUser.id, 
        'Delete', 
        'Plan de remboursement', 
        `${id}`, 
        'Suppression du plan de remboursement'
      ).subscribe(() => {
        this.planRemboursement
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

  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditPlanRemboursementDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 

  
  compareFn(c1: BanqueModel, c2: BanqueModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareSecteurFn(c1: SecteurModel, c2: SecteurModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  }
}


@Component({
  selector: 'edit-plan-remboursement-dialog',
  templateUrl: './plan-remboursement-edit.html',
})
export class EditPlanRemboursementDialogBox implements OnInit{
  isLoading = false;

  formGroup!: FormGroup;
 

  currentUser: UserModel | any;

  plan_remboursement: PlanRemboursementModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EditPlanRemboursementDialogBox>,
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService, 
      private toastr: ToastrService, 
      private planRemboursementService: PlanRemboursementService,
      private logService: LogUserService,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({  
      date_de_rembousement: [''],
      credit_en_debut_periode: [''],
      // mensualite: [''],
      interet: [''],
      capital: [''],
    }); 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
        this.planRemboursementService.get(parseInt(this.data['id'])).subscribe(item => {
          this.plan_remboursement = item;
          this.formGroup.patchValue({
            date_de_rembousement: item.date_de_rembousement,
            credit_en_debut_periode: item.credit_en_debut_periode,
            // mensualite: item.mensualite,
            interet: item.interet,
            capital: item.capital,
            signature: this.currentUser.matricule, 
            update_created: new Date(),
          });
        });
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
      this.planRemboursementService.update(parseInt(this.data['id']), this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.logService.createLog(
            this.currentUser.id, 
            'Update', 
            'Beneficiaire', 
            `${this.plan_remboursement.beneficiaire.name_beneficiaire}`, 
            'Modification du plan de remboursement'
          ).subscribe(() => {
            this.isLoading = false;
            this.toastr.success('Modification enregistré!', 'Success!');
            // window.location.reload();
            this.close();
          });
        },
        error: err => {
          this.isLoading = false;
          console.log(err);
          this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  close(){
      this.dialogRef.close(true);
  } 

}


