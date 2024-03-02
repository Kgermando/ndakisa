import { Component, OnInit } from '@angular/core';
import { BeneficiareService } from 'src/app/beneficiaires/beneficiare.service';
import { NotificationService } from '../notification.service';
import { BeneficiaireModel } from 'src/app/beneficiaires/models/beneficiaire.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { NotificationModel } from '../models/notification.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from 'src/app/users/models/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { LogUserService } from 'src/app/logs/log-user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification-view',
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.scss']
})
export class NotificationViewComponent implements OnInit {
 
  isLoading = false;

  beneficiaire: BeneficiaireModel;
  notificationList: NotificationModel[] = [];

  date_de_rembousement: Date;
 
  isLoadingForm = false;
  formGroup!: FormGroup;
  currentUser: UserModel | any; 
  id: any;

  dateNowMonth: number;
  dateNowYear: number;

  totalRembourser: number = 0;
  totalPayer: number = 0;
  pourcentRemboursement: number = 0;

  constructor( 
    public themeService: CustomizerSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService, 
    private beneficiaireServce: BeneficiareService, 
    private notificationService: NotificationService,
    private logService: LogUserService,
    public dialog: MatDialog,
    private toastr: ToastrService) {}


  ngOnInit(): void {
    this.isLoading = true;
    var date = new Date();
    this.dateNowMonth = date.getMonth() +1;
    this.dateNowYear = date.getFullYear();
    this.formGroup = this.formBuilder.group({  
      rappel: ['', Validators.required],
      observation: ['', Validators.required],
    });
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.route.params.subscribe(routeParams => {
          this.beneficiaireServce.refreshDataList$.subscribe(() => {
            this.loadData(routeParams['id']);
          });
          this.id = routeParams['id'];
          this.date_de_rembousement = routeParams['date-de-rembousement'];
          this.loadData(routeParams['id']);
        });
      },
      error: (error) => {
        this.isLoading = false; 
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });   
  }


  loadData(id: any) {
    this.beneficiaireServce.get(Number(id)).subscribe(item => {
      this.beneficiaire = item; 
      this.notificationService.refreshDataList$.subscribe(() => {
        this.getData(id);
      });
      this.getData(id);
      this.isLoading = false; 
    });
  }

  getData(id: any) {
    this.notificationService.getNotification(Number(id)).subscribe(item => {
      this.notificationList = item;
    });
    this.notificationService.getTotalRemboursements(Number(id)).subscribe(item => {
      var total = item[0];
      this.totalRembourser = total.totalarembourser;
      this.totalPayer = total.totalpayer;
      this.pourcentRemboursement = this.totalPayer * 100 / this.totalRembourser;
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoadingForm = true;
        var body = {
          beneficiaire: this.id,
          rappel: this.formGroup.value.rappel,
          observation: this.formGroup.value.observation,
          signature: this.currentUser.matricule, 
          created: new Date(),
          update_created: new Date(),
        };
        this.notificationService.create(body).subscribe({
          next: (res) => {
            this.logService.createLog(
              this.currentUser.id, 
              'Create', 
              'Rappel bénéficiaire', 
              `${res.name_secteur}`, 
              'Rappel bénéficiaire pour échéance.'
            ).subscribe(() => {
              this.isLoadingForm = false;
              this.formGroup.reset(); 
              this.toastr.success('Ajouter avec succès!', 'Success!');
            }); 
          },
          error: (err) => {
            this.isLoadingForm = false;
            this.toastr.error('Une erreur s\'est produite!', 'Oupss!');
            console.log(err);
          }
        });
      }
    } catch (error) {
      this.isLoadingForm = false;
      console.log(error);
    }
  } 


  getMonth(month: number) {
    switch (month) {
      case this.dateNowMonth = 1:
        return 'Janvier'; 
      case this.dateNowMonth = 2:
        return 'Fevrier';
      case this.dateNowMonth = 3:
        return 'Mars';
      case this.dateNowMonth = 4:
        return 'Avril';
      case this.dateNowMonth = 5:
        return 'Mai';
      case this.dateNowMonth = 6:
        return 'Juin';
      case this.dateNowMonth = 7:
        return 'Jeuillet';
      case this.dateNowMonth = 8:
        return 'Aout';
      case this.dateNowMonth = 9:
        return 'Septembre';
      case this.dateNowMonth = 10:
        return 'Octobre'; 
      case this.dateNowMonth = 11:
        return 'Novembre';
      case this.dateNowMonth = 12:
        return 'Decembre';
      default: 
        return ''; 
    }
  }


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ConfirmatioRappelDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration, 
    }); 
  } 


  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      this.logService.createLog(
        this.currentUser.id, 
        'Delete', 
        'User', 
        `${this.beneficiaire.name_beneficiaire}`,
        'Suppression de rappel.'
      ).subscribe(() => {
        this.notificationService
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



  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleCardBorderTheme() {
      this.themeService.toggleCardBorderTheme();
  }

  toggleCardBorderRadiusTheme() {
      this.themeService.toggleCardBorderRadiusTheme();
  }
}



@Component({
  selector: 'confirmation-rappel-dialog',
  templateUrl: './confirmation-rappel.html',
})
export class ConfirmatioRappelDialogBox { 

  constructor( 
      public dialogRef: MatDialogRef<ConfirmatioRappelDialogBox>, 
  ) {}
 
 
 
  close(){
      this.dialogRef.close(true);
  }  
}
