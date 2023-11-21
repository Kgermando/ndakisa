import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { permissionDataList } from 'src/app/shared/tools/permission-list';
import { RoleDataList } from 'src/app/shared/tools/role-list';
import { UserModel } from '../models/user.model';
import { LogUserService } from '../../logs/log-user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  isLoading: boolean = false; 
  formGroup!: FormGroup;

  currentUser: UserModel | any; 
  user: UserModel;

 
  sexeList: string[] = [
    'Femme', 'Homme'
  ]; 

  roleList: string[] = RoleDataList;
  permissionList = permissionDataList;

  id: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private authService: AuthService, 
    private userService: UserService,
    private logService: LogUserService,
    private toastr: ToastrService) {}



  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; 
    this.formGroup = this._formBuilder.group({
      nom: [''],
      postnom: [''],
      prenom: [''],
      email: [''],
      telephone: [''],
      adresse: [''],
      sexe: [''],
      matricule: [''],  
      title: [''], 
      statut_user: [''],
      roles: [''],
      permission: [''],
    });

    this.authService.user().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userService.get(this.id).subscribe(item => { 
          this.user = item; 
            this.formGroup.patchValue({
              nom: this.capitalizeTest(item.nom),
              postnom: this.capitalizeTest(item.postnom),
              prenom: this.capitalizeTest(item.prenom),
              email: this.capitalizeTest(item.email),
              telephone: item.telephone,
              adresse: this.capitalizeTest(item.adresse),
              sexe: item.sexe,
              title: this.capitalizeTest(item.title),
              matricule: item.matricule,
              statut_user: item.statut_user,
              roles: item.roles, 
              permission: item.permission,
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
      this.userService.update(this.id, this.formGroup.getRawValue())
      .subscribe({
        next: () => {
          this.logService.createLog(
            this.currentUser.id, 
            'Update', 
            'User', 
            `${this.user.prenom} ${this.user.nom}`,
            'Modification de l\'utilisateur.'
          ).subscribe(() => {
            this.toastr.success('Modification enregistré!', 'Success!');
            this.router.navigate(['/layouts/users/user-list']);
            this.isLoading = false;
          });
          
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
