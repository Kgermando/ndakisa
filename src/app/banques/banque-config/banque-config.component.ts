import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserModel } from 'src/app/users/models/user.model';
import { BanqueService } from '../banque.service';
import { ToastrService } from 'ngx-toastr';
import { LogUserService } from 'src/app/logs/log-user.service';
import { BanqueModel } from '../models/banque.model';
import { MatDialog } from '@angular/material/dialog';
import { EditBanqueDialogBox } from '../banque-list/banque-list.component'; 

@Component({
  selector: 'app-banque-config',
  templateUrl: './banque-config.component.html',
  styleUrls: ['./banque-config.component.scss']
})
export class BanqueConfigComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any;

  banquelist: BanqueModel[] = [];

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private banqueService: BanqueService,  
    private logService: LogUserService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      name_banque: ['', Validators.required],
    });
 
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.banqueService.refreshDataList$.subscribe(() => {
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

  getAllData() {
    this.banqueService.getAll().subscribe(res => {
      this.banquelist = res;
    });
  }
 

  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          name_banque: this.capitalizeTest(this.formGroup.value.name_banque),
          statut: true,
          signature: this.currentUser.matricule,
          created: new Date(),
          update_created: new Date(),
        };
        this.banqueService.create(body).subscribe({
          next: (res) => {
            this.logService.createLog(
              this.currentUser.id, 
              'Create', 
              'Banque', 
              `${res.name_banque}`, 
              'Création d\'une banque.'
            );
            this.isLoading = false;
            this.formGroup.reset();
            this.toastr.success('Ajouter avec succès!', 'Success!');
          },
          error: (err) => {
            this.isLoading = false;
            this.toastr.error(`${err.error.message}`, 'Oupss!');
            console.log(err);
          }
        });
      }
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  } 


  openEditDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: number): void {
    this.dialog.open(EditBanqueDialogBox, {
      width: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id: id
      }
    }); 
  } 
 

  capitalizeTest(text: string): string {
    return (text && text[0].toUpperCase() + text.slice(1).toLowerCase()) || text;
  } 

}
 