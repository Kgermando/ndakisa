import { Component } from '@angular/core';
import { Validators } from 'ngx-editor';
import { CustomizerSettingsService } from 'src/app/common/customizer-settings/customizer-settings.service';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/users/models/user.model';
import { LogUserService } from 'src/app/logs/log-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide = true;

  isLoading = false; 

  form : FormGroup | any

  constructor(
    public themeService: CustomizerSettingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private logService: LogUserService,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
      this.form = this.formBuilder.group({
        matricule: ['', Validators.required],
        password: ['', Validators.required]
      });
  }


  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      var body = {
        matricule: this.form.value.matricule.toLowerCase(),
        password: this.form.value.password
      };
      this.authService.login(body).subscribe({
          next: (res) => {
            this.logService.createLog(
              res.id,
              'Login', 
              'User', 
              `${res.prenom} ${res.nom}`,
              'Authentification réussi.'
            ).subscribe(() => {
              let user: UserModel = res;
              let roleList = JSON.stringify(user.roles);
              localStorage.removeItem('roles');
              localStorage.setItem('roles', roleList);
              if (user.statut_user) {
                if (user.roles[0] === 'Dashboard') { 
                  this.router.navigate(['/layouts/dashboard']);  
                } else if (user.roles[0] === 'Cohortes') { 
                  this.router.navigate(['/layouts/cohortes/cohorte-list']);
                } else if (user.roles[0] === 'Banques') { 
                  this.router.navigate(['/layouts/banques/banque-list']);
                } else if (user.roles[0] === 'Beneficiaires') { 
                  this.router.navigate(['/layouts/beneficiaires/beneficiaire-list']);
                } else if (user.roles[0] === 'users') { 
                  this.router.navigate(['/layouts/users/user-list']);
                } else {
                  this.router.navigate(['/auth/login']);
                }
              } else {
                this.router.navigate(['/auth/login']);
              }
              this.toastr.success(`Bienvenue ${user.prenom}!`, 'Success!');
              this.isLoading = false;
            });
          },
          error: (e) => {
            this.isLoading = false;
            console.error(e);
            // this.toastr.error('Votre matricule ou le mot de passe ou encore les deux ne sont pas correct !', 'Oupss!');
            this.toastr.error(`${e.error.message}`, 'Oupss!');
            this.router.navigate(['/auth/login']); 
          }, 
        }
      ); 
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
