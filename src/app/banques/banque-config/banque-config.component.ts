import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserModel } from 'src/app/users/models/user.model';
import { BanqueService } from '../banque.service';
import { ToastrService } from 'ngx-toastr';
import { LogUserService } from 'src/app/users/log-user.service';

@Component({
  selector: 'app-banque-config',
  templateUrl: './banque-config.component.html',
  styleUrls: ['./banque-config.component.scss']
})
export class BanqueConfigComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private banqueService: BanqueService, 
    private logService: LogUserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user; 
      },
      error: (error) => {
        this.router.navigate(['/auth/login']);
        console.log(error);
      }
    });

    this.formGroup = this._formBuilder.group({
      name_banque: ['', Validators.required],
    });
  }


  onSubmit() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true;
        var body = {
          name_banque: this.capitalizeTest(this.formGroup.value.name_banque),
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
